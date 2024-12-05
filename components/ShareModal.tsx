import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {useToast} from "@/hooks/use-toast";
import React from "react";

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  mindMapId: string
  isPublic: boolean
}

export function ShareModal({ isOpen, onClose, mindMapId, isPublic: initialIsPublic }: ShareModalProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const { toast } = useToast()
  const shareUrl = `${window.location.origin}/mindmap/share/${mindMapId}`

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/mindmaps/${mindMapId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic }),
      })

      if (!response.ok) {
        throw new Error('Failed to update sharing settings')
      }

      toast({
        title: 'Success',
        description: 'Sharing settings updated successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update sharing settings. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: 'Copied!',
      description: 'Share link copied to clipboard.',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Mind Map</DialogTitle>
          <DialogDescription>
            Make your mind map public and share it with others.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="public-mindmap"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public-mindmap">Make mind map public</Label>
          </div>
          {isPublic && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="share-link" className="text-right">
                Share Link
              </Label>
              <Input
                id="share-link"
                value={shareUrl}
                className="col-span-3"
                readOnly
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleShare}>
            Save changes
          </Button>
          {isPublic && (
            <Button type="button" variant="secondary" onClick={copyToClipboard}>
              Copy Link
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

