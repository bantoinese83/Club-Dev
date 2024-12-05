'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EntryCard } from '@/components/EntryCard';
import { useToast } from '@/hooks/use-toast';

interface Entry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: { id: string; name: string }[];
  category: { id: string; name: string } | null;
  user: {
    id: string;
    name: string;
    image: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export function PinnedEntries() {
  const [pinnedEntries, setPinnedEntries] = useState<Entry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPinnedEntries();
  }, []);

  const fetchPinnedEntries = async () => {
    try {
      const response = await fetch('/api/entries/pinned');
      if (!response.ok) throw new Error('Failed to fetch pinned entries');
      const data = await response.json();
      setPinnedEntries(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch pinned entries',
        variant: 'destructive',
      });
    }
  };

  const unpinEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/entries/${entryId}/unpin`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to unpin entry');
      fetchPinnedEntries();
      toast({
        title: 'Success',
        description: 'Entry unpinned successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unpin entry',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pinned Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {pinnedEntries.length === 0 ? (
          <p>No pinned entries yet.</p>
        ) : (
          <div className="space-y-4">
            {pinnedEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between">
                <EntryCard entry={entry} />
                <Button onClick={() => unpinEntry(entry.id)} variant="outline" size="sm">
                  Unpin
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}