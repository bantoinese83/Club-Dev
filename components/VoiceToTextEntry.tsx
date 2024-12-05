'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Mic, MicOff, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import React from 'react'

type SpeechRecognitionEvent = any
type SpeechRecognitionErrorEvent = any

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
export function VoiceToTextEntry() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState('')
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        setNote(finalTranscript + interimTranscript)
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        toast({
          title: 'Error',
          description: `Speech recognition error: ${event.error}`,
          variant: 'destructive',
        })
      }
    } else {
      toast({
        title: 'Error',
        description: 'Speech recognition is not supported in this browser.',
        variant: 'destructive',
      })
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [toast])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
    setIsListening(!isListening)
  }

  const saveNote = async () => {
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: note, title: 'Voice Note' }),
      })

      if (!response.ok) {
        throw new Error('Failed to save note')
      }

      setNote('')
      toast({
        title: 'Success',
        description: 'Voice note saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save voice note',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice-to-Text Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Your voice note will appear here..."
            rows={6}
          />
          <div className="flex justify-between">
            <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'default'}>
              {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>
            <Button onClick={saveNote} disabled={!note.trim()}>
              <Save className="mr-2 h-4 w-4" />
              Save Note
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}