const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000";

type EventHandler = (data: Record<string, unknown>) => void;

export class SocketClient {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, EventHandler[]>();
  private assignmentId: string;
  private destroyed = false;
  private retries = 0;
  private maxRetries = 5;

  constructor(assignmentId: string) {
    this.assignmentId = assignmentId;
  }

  connect() {
    if (this.destroyed) return;

    try {
      this.ws = new WebSocket(WS_URL);
    } catch {
      console.warn("WebSocket connection failed, will not retry");
      return;
    }

    this.ws.onopen = () => {
      this.retries = 0;
      this.ws?.send(
        JSON.stringify({ type: "subscribe", assignmentId: this.assignmentId })
      );
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const eventName = data.event as string;
        const handlers = this.handlers.get(eventName);
        handlers?.forEach((handler) => handler(data));
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      if (this.destroyed) return;
      if (this.retries >= this.maxRetries) return;
      this.retries++;
      const delay = Math.min(3000 * this.retries, 15000);
      setTimeout(() => this.connect(), delay);
    };

    this.ws.onerror = () => {
      // onclose will fire after this, which handles retry
    };
  }

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  disconnect() {
    this.destroyed = true;
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}
