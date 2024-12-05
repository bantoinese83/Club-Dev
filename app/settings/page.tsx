'use client'
import React from 'react';

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {useToast} from "@/hooks/use-toast";

export default function SettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    emailNotifications: false,
    privateProfile: false,
  })

  useEffect(() => {
    if (session) {
      fetchUserSettings()
    }
  }, [session])

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch user settings')
      }
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching user settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load user settings. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const updateSetting = async (key: string, value: boolean) => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user settings')
      }

      setSettings(prev => ({ ...prev, [key]: value }))
      toast({
        title: 'Success',
        description: 'Settings updated successfully.',
      })
    } catch (error) {
      console.error('Error updating user settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Private Profile</span>
            <Switch
              checked={settings.privateProfile}
              onCheckedChange={(checked) => updateSetting('privateProfile', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

