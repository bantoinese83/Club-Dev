'use client'
import React from "react";

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Star, Trophy } from 'lucide-react'

export function UserProgress() {
  const { data: session } = useSession()
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const fetchUserProgress = async () => {
      const response = await fetch('/api/user/progress')
      const data = await response.json()
      setLevel(data.level)
      setXp(data.experiencePoints)
      setAchievements(data.achievements)
    }

    if (session) {
      fetchUserProgress()
    }
  }, [session])

  const xpForNextLevel = level * 100
  const progress = (xp / xpForNextLevel) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 text-yellow-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Level {level}</span>
            <Badge variant="secondary" className="text-lg">
              {xp} / {xpForNextLevel} XP
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {xpForNextLevel - xp} XP needed for next level
          </p>
          <div>
            <h4 className="font-semibold mb-2">Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} variant="outline" className="flex items-center">
                  <Star className="mr-1 h-3 w-3 text-yellow-500" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

