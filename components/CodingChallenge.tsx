'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  description: string;
}

export function CodingChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [solution, setSolution] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const response = await fetch('/api/coding-challenge');
      if (!response.ok) throw new Error('Failed to fetch coding challenge');
      const data: Challenge = await response.json();
      setChallenge(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch coding challenge',
        variant: 'destructive',
      });
    }
  };

  const submitSolution = async () => {
    if (!challenge) return;

    try {
      const response = await fetch(`/api/coding-challenge/${challenge.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solution }),
      });
      if (!response.ok) throw new Error('Failed to submit solution');
      const result = await response.json();
      toast({
        title: result.success ? 'Success' : 'Incorrect',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        fetchChallenge();
        setSolution('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit solution',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Coding Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        {challenge ? (
          <>
            <p className="mb-4">{challenge.description}</p>
            <Textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Enter your solution here"
              rows={6}
              className="mb-4"
            />
            <Button onClick={submitSolution}>Submit Solution</Button>
          </>
        ) : (
          <p>Loading challenge...</p>
        )}
      </CardContent>
    </Card>
  );
}