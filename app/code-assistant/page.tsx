'use client'
import React from 'react';

import { Seo } from '@/components/Seo'
import { CodeGenerator } from '@/components/CodeGenerator'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAnimation } from '@/contexts/AnimationContext'

export default function CodeAssistantPage() {
  const { reducedMotion } = useAnimation()
  return (
    <>
      <Seo 
        title="Code Assistant"
        description="Generate code snippets with AI assistance"
      />
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: 1 }}
        transition={reducedMotion ? undefined : { duration: 0.3 }}
      >
        <motion.h1 
          className="text-3xl font-bold mb-6 text-foreground"
          initial={reducedMotion ? false : { y: -20 }}
          animate={reducedMotion ? undefined : { y: 0 }}
          transition={reducedMotion ? undefined : { delay: 0.1, type: 'spring', stiffness: 150, damping: 15 }}
        >
          Code Assistant
        </motion.h1>
        <motion.div
          initial={reducedMotion ? false : { y: 20, opacity: 0 }}
          animate={reducedMotion ? undefined : { y: 0, opacity: 1 }}
          transition={reducedMotion ? undefined : { delay: 0.2, duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Code Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeGenerator />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}

