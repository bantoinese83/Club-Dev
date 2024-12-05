'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface WebSocketContextType {
  socket: Socket | null;
}

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const WebSocketContext = createContext<WebSocketContextType>({ socket: null });

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession() as { data: CustomSession | null };

  useEffect(() => {
    if (session?.user?.id) {
      const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000', {
        query: { userId: session.user.id },
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [session]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
}