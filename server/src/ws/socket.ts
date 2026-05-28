import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface WSMessage {
  type: string;
  assignmentId?: string;
  [key: string]: unknown;
}

const rooms = new Map<string, Set<WebSocket>>();

let wss: WebSocketServer;

export function initWebSocket(server: Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    let subscribedRoom: string | null = null;

    ws.on("message", (data) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());

        if (message.type === "subscribe" && message.assignmentId) {
          subscribedRoom = message.assignmentId;
          if (!rooms.has(subscribedRoom)) {
            rooms.set(subscribedRoom, new Set());
          }
          rooms.get(subscribedRoom)!.add(ws);
        }
      } catch {
        // ignore malformed messages
      }
    });

    ws.on("close", () => {
      if (subscribedRoom && rooms.has(subscribedRoom)) {
        rooms.get(subscribedRoom)!.delete(ws);
        if (rooms.get(subscribedRoom)!.size === 0) {
          rooms.delete(subscribedRoom);
        }
      }
    });
  });
}

export function emitToRoom(assignmentId: string, event: string, data: Record<string, unknown>) {
  const clients = rooms.get(assignmentId);
  if (!clients) return;

  const message = JSON.stringify({ event, ...data });
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}
