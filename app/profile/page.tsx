'use client'
import React from 'react';

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Seo } from '@/components/Seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnimation } from '@/contexts/AnimationContext'
import { UserGamificationProfile } from '@/components/UserGamificationProfile'
import { Leaderboard } from '@/components/Leaderboard'
import {useAppContext} from "@/components/AppContext";

export default function ProfilePage() {
  const { data: session } = useSession()
  const { challenges, fetchChallenges } = useAppContext()
  const { reducedMotion, toggleReducedMotion } = useAnimation()

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      const response = await fetch('/api/challenges/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete challenge')
      }

      await fetchChallenges()
    } catch (error) {
      console.error('Error completing challenge:', error)
    }
  }

  return (
    <>
      <Seo 
        title="Profile"
        description="View and manage your ClubDev profile."
      />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-foreground">Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserGamificationProfile />
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">User Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <img src={session?.user?.image || "/placeholder.svg"} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <p className="text-lg font-medium text-foreground">{session?.user?.name || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">{session?.user?.email || 'No email provided'}</p>
                  </div>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>GitHub: Connected</p>
                  <p>Notion: Connected</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Leaderboard />
          </div>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-foreground">Community Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.map(challenge => (
                  <div key={challenge.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">{challenge.name}</p>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="text-foreground border-foreground hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleCompleteChallenge(challenge.id)}
                    >
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-foreground">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Reduced Motion</span>
                  <Switch
                    checked={reducedMotion}
                    onCheckedChange={toggleReducedMotion}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Enable Notifications</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Dark Mode</span>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full text-foreground border-foreground hover:bg-primary hover:text-primary-foreground">Manage GitHub Integration</Button>
                  <Button variant="outline" className="w-full text-foreground border-foreground hover:bg-primary hover:text-primary-foreground">Manage Notion Integration</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}

