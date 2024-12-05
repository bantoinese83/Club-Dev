'use client'
import React from "react";

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {useToast} from "@/hooks/use-toast";

export function AICodeReviewer() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [review, setReview] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setReview('')

    try {
      const response = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })

      if (!response.ok) {
        throw new Error('Failed to get code review')
      }

      const data = await response.json()
      setReview(data.review)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get code review. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Code Reviewer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={10}
          />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Reviewing...' : 'Get AI Code Review'}
          </Button>
        </form>
        {review && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">AI Code Review:</h3>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
              {review}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

