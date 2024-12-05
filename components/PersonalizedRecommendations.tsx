'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  codeSnippet?: string;
  codeLanguage?: string;
  isRecommended?: boolean;
  mediaUrl?: string;
  mediaType?: string;
}

export function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<Entry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data: Entry[] = await response.json();
      setRecommendations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch recommendations',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          <div className="space-y-4">
            {recommendations.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}