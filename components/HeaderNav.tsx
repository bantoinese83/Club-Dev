'use client'
import React from "react";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Logo } from './Logo'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useTheme } from "next-themes"
import { Moon, Sun } from 'lucide-react'
import { NotificationCenter } from './NotificationCenter'
import { useAnimation } from '@/contexts/AnimationContext'

export function HeaderNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { reducedMotion } = useAnimation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/journal' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Feed', path: '/feed' },
    { name: 'Prompts', path: '/prompts' },
    { name: 'Code Assistant', path: '/code-assistant' },
    { name: 'Mind Map', path: '/mindmap' },
    { name: 'AI Assistance', path: '/ai-assistance' },
    { name: 'Settings', path: '/settings' }, // Added Settings nav item
    { name: 'Profile', path: '/profile' },
  ]

  function ThemeToggle() {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <motion.header 
      className="bg-background"
      initial={reducedMotion ? false : { y: -100 }}
      animate={reducedMotion ? undefined : { y: 0 }}
      transition={reducedMotion ? undefined : { type: 'spring', stiffness: 120, damping: 20 }}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center" id="nav">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="text-primary" />
            <span className="text-2xl font-bold text-foreground">
              Club<span className="text-primary">Dev</span>
            </span>
          </Link>
        </motion.div>
        <ul className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <motion.li 
              key={item.name}
              initial={reducedMotion ? false : { opacity: 0, y: -20 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={reducedMotion ? undefined : { delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.path
                    ? 'text-primary'
                    : 'text-foreground'
                }`}
                id={item.path === '/profile' ? 'profile-link' : item.path === '/feed' ? 'feed-link' : undefined} // IDs for GuidedTour.tsx
              >
                {item.name}
              </Link>
            </motion.li>
          ))}
        </ul>
        {session ? (
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-sm font-medium text-foreground">
              Welcome, {session.user?.name}
            </span>
            <NotificationCenter />
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => signOut()} variant="outline">
                Sign Out
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </motion.div>
            <ThemeToggle />
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}

