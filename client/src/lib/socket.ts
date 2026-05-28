const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000";

type EventHandler = (data: Record<string, unknown>) => void;

export class SocketClient {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, EventHandler[]>();
  private assignmentId: string;

  constructor(assignmentId: string) {
    this.assignmentId = assignmentId;
  }

  connect() {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
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
      setTimeout(() => this.connect(), 3000);
    };
  }

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}
