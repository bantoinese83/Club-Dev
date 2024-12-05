'use client'
import React from "react";

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {useToast} from "@/hooks/use-toast";

export function AIWritingAssistant() {
  const [content, setContent] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuggestions('')

    try {
      const response = await fetch('/api/ai/writing-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to get writing suggestions')
      }

      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get writing suggestions. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Writing Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text here..."
            rows={10}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Getting suggestions...' : 'Get Writing Suggestions'}
          </Button>
        </form>
        {suggestions && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">AI Suggestions:</h3>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
              {suggestions}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

