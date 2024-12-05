'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type Entry = {
  _count: { comments: number; likes: number };
  category: null;
  id: string
  title: string
  content: string
  createdAt: string
  tags: { id: string; name: string }[]
  user: {
    id: string;
    name: string
    image: string
  }
  likes: { userId: string }[]
  comments: { id: string }[]
  codeSnippet?: string
  codeLanguage?: string
}

type Achievement = {
  id: string
  name: string
  description: string
  unlockedAt: string
}

type Challenge = {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
}

type Notification = {
  id: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

type AppContextType = {
  entries: Entry[]
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
  achievements: Achievement[]
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>
  challenges: Challenge[]
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  fetchEntries: () => Promise<void>
  fetchAchievements: () => Promise<void>
  fetchChallenges: () => Promise<void>
  fetchNotifications: () => Promise<void>
  markNotificationAsRead: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { data: session } = useSession()

  const fetchEntries = async () => {
    if (session) {
      const res = await fetch('/api/entries')
      const data = await res.json()
      setEntries(data)
    }
  }

  const fetchAchievements = async () => {
    if (session) {
      const res = await fetch('/api/achievements')
      const data = await res.json()
      setAchievements(data)
    }
  }

  const fetchChallenges = async () => {
    if (session) {
      const res = await fetch('/api/challenges')
      const data = await res.json()
      setChallenges(data)
    }
  }

  const fetchNotifications = async () => {
    if (session) {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      setNotifications(data)
    }
  }

  const markNotificationAsRead = async (id: string) => {
    if (session) {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setNotifications(prev => prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ))
      }
    }
  }

  useEffect(() => {
    if (session) {
      fetchEntries()
      fetchAchievements()
      fetchChallenges()
      fetchNotifications()
    }
  }, [session])

  return (
    <AppContext.Provider value={{
      entries,
      setEntries,
      achievements,
      setAchievements,
      challenges,
      setChallenges,
      notifications,
      setNotifications,
      fetchEntries,
      fetchAchievements,
      fetchChallenges,
      fetchNotifications,
      markNotificationAsRead
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

