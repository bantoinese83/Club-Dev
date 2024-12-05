'use client'
import React from "react";

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {useToast} from "@/hooks/use-toast";

interface ReputationBadgeProps {
  userId: string
}

export function ReputationBadge({ userId }: ReputationBadgeProps) {
  const [reputation, setReputation] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/reputation`)
        if (!response.ok) {
          throw new Error('Failed to fetch reputation')
        }
        const data = await response.json()
        setReputation(data.reputation.score)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch user reputation.',
          variant: 'destructive',
        })
      }
    }

    fetchReputation()
  }, [userId, toast])

  return (
    <Badge variant="secondary" className="ml-2">
      Rep: {reputation}
    </Badge>
  )
}

