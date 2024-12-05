'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Flag } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FlagButtonProps {
  entryId: string
}

export function FlagButton({ entryId }: FlagButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/entries/${entryId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        throw new Error('Failed to flag entry')
      }

      toast({
        title: 'Entry Flagged',
        description: 'Thank you for your report. We will review it shortly.',
      })
      setIsOpen(false)
      setReason('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to flag entry. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Flag className="w-4 h-4 mr-2" />
          Flag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flag Inappropriate Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Please provide a reason for flagging this content"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <Button type="submit">Submit Flag</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

