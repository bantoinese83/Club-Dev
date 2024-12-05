'use client'
import React from 'react';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import {useToast} from "@/hooks/use-toast";

interface Session {
  id: string;
  title: string;
  creator: {
    name: string;
  };
  participants: {
    length: number;
  };
}
export function CollaborativeSession() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();
  useSession(); // Removed the unused session variable

  useEffect(() => {
    const newSocket = io('/collaborative-sessions');
    setSocket(newSocket);

    newSocket.on('sessionUpdate', (updatedSessions: Session[]) => {
      setSessions(updatedSessions);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const response = await fetch('/api/collaborative-sessions');
    const data: Session[] = await response.json();
    setSessions(data);
  };

  const createSession = async () => {
    try {
      const response = await fetch('/api/collaborative-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSessionTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      toast({
        title: 'Session Created',
        description: 'Your collaborative coding session has been created.',
      });
      setNewSessionTitle('');
      fetchSessions();
      socket?.emit('newSession');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const joinSession = (sessionId: string) => {
    console.log(`Joining session ${sessionId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={newSessionTitle}
          onChange={(e) => setNewSessionTitle(e.target.value)}
          placeholder="New session title"
        />
        <Button onClick={createSession}>Create Session</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Created by: {session.creator.name}</p>
              <p>Participants: {session.participants.length}</p>
              <Button className="mt-2" onClick={() => joinSession(session.id)}>Join Session</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}