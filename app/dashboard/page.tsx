import { Seo } from '@/components/Seo'
import { PinnedEntries } from '@/components/PinnedEntries'
import { GoalTracker } from '@/components/GoalTracker'
import { PersonalizedRecommendations } from '@/components/PersonalizedRecommendations'
import { CodingChallenge } from '@/components/CodingChallenge'
import { ProductivityTracker } from '@/components/ProductivityTracker'
import { VoiceToTextEntry } from '@/components/VoiceToTextEntry'
import React from 'react';

export default function DashboardPage() {
  return (
    <>
      <Seo 
        title="Personal Dashboard"
        description="Your personalized ClubDev dashboard"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PinnedEntries />
          <GoalTracker />
          <PersonalizedRecommendations />
          <CodingChallenge />
          <ProductivityTracker />
          <VoiceToTextEntry />
        </div>
      </div>
    </>
  )
}

