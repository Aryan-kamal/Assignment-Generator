"use client";

import { useEffect, useRef } from "react";
import { SocketClient } from "@/lib/socket";

export function useSocket(
  assignmentId: string | null,
  handlers: Record<string, (data: Record<string, unknown>) => void>
) {
  const socketRef = useRef<SocketClient | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    const socket = new SocketClient(assignmentId);
    socketRef.current = socket;

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]);

  return socketRef;
}
