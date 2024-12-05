import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import React from 'react'

interface UserGamificationProps {
  userId: string
}

interface BadgeType {
  id: string
  name: string
  description: string
  imageUrl: string
}

export function UserGamification({ userId }: UserGamificationProps) {
  const [points, setPoints] = useState(0)
  const [badges, setBadges] = useState<BadgeType[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/gamification')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      const data = await response.json()
      setPoints(data.points)
      setBadges(data.badges)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gamification</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">Points: {points}</p>
        <div>
          <h3 className="text-lg font-semibold mb-2">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge.id} variant="secondary" className="p-2">
                <img src={badge.imageUrl} alt={badge.name} className="w-6 h-6 mr-2" />
                {badge.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

