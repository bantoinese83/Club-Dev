'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {useToast} from "@/hooks/use-toast";
import React from 'react';

export default function WritingPromptsPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generatePrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }
      const data = await response.json();
      setPrompt(data.prompt);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate a prompt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">AI-Powered Writing Prompts</h1>
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Today&apos;s Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">{prompt || 'Click the button to generate a prompt.'}</p>
          <Button onClick={generatePrompt} disabled={loading}>
            {loading ? 'Generating...' : 'Generate New Prompt'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}