'use client'
import React from "react";

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SnowflakeIcon as Confetti } from 'lucide-react'
import {toast} from "@/hooks/use-toast";

export function StreakChallenge() {
  const { data: session } = useSession()
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [nextMilestone, setNextMilestone] = useState(0)

  useEffect(() => {
    const fetchStreakData = async () => {
      const response = await fetch('/api/user/streak')
      const data = await response.json()
      setStreak(data.currentStreak)
      setLongestStreak(data.longestStreak)
      setNextMilestone(Math.ceil(data.currentStreak / 10) * 10)
    }

    if (session) {
      fetchStreakData()
    }
  }, [session])

  const handleIncrementStreak = async () => {
    try {
      const response = await fetch('/api/user/streak', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to increment streak')
      const data = await response.json()
      setStreak(data.currentStreak)
      setLongestStreak(data.longestStreak)
      setNextMilestone(Math.ceil(data.currentStreak / 10) * 10)
      toast({
        title: 'Streak Updated!',
        description: `Your current streak is now ${data.currentStreak} days!`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update streak',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flame className="mr-2 text-orange-500" />
          Coding Streak Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Current Streak:</span>
            <Badge variant="secondary" className="text-lg">
              {streak} days
            </Badge>
          </div>
          <Progress value={(streak / nextMilestone) * 100} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {streak} / {nextMilestone} days to next milestone
          </p>
          <div className="flex justify-between items-center">
            <span>Longest Streak:</span>
            <Badge variant="outline" className="text-lg">
              {longestStreak} days
            </Badge>
          </div>
          {streak >= 7 && (
            <p className="text-sm font-medium text-green-500">
              🎉 You&#39;ve maintained your streak for a week! Keep it up!
            </p>
          )}
          <Button onClick={handleIncrementStreak} disabled={streak >= longestStreak}>
            {streak === 0 ? 'Start Streak' : 'Increment Streak'}
          </Button>
          {streak > 0 && (
            <div className="flex items-center space-x-2">
              <Confetti className="text-yellow-500 w-5 h-5" />
              <span>Keep up the great work!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

