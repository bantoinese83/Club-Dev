'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'

type AnimationContextType = {
  reducedMotion: boolean
  toggleReducedMotion: () => void
}

interface CustomSession extends Session {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const { data: session } = useSession() as { data: CustomSession | null }

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch user preference from API
      fetch('/api/user/animation-preference')
        .then(res => res.json())
        .then(data => setReducedMotion(data.reducedMotion))
    }
  }, [session])

  const toggleReducedMotion = async () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    if (session?.user?.id) {
      // Update user preference in the database
      await fetch('/api/user/animation-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reducedMotion: newValue }),
      })
    }
  }

  return (
    <AnimationContext.Provider value={{ reducedMotion, toggleReducedMotion }}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}