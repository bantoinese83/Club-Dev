'use client'
import React from 'react';
import { useState, useEffect } from 'react'
import Joyride, { ACTIONS, EVENTS, STATUS, Step, CallBackProps } from 'react-joyride'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'

// Define tour steps
const TOUR_STEPS: Step[] = [
  {
    target: 'nav',
    title: 'Welcome to ClubDev!',
    content: 'This guided tour will walk you through the main features of the app.',
    placement: 'center',
    disableBeacon: true, // Hide the beacon for the first step
  },
  {
    target: 'nav',
    title: 'Navigation',
    content: 'Use the navigation bar to access different sections of the app, like your journal, the community feed, and your profile.',
    placement: 'bottom',
  },
  {
    target: '#new-entry-button', // Replace with the actual ID of your new entry button
    title: 'New Entry',
    content: 'Click here to create a new journal entry and record your coding progress.',
    placement: 'left',
  },
  {
    target: '#recent-entries', // Replace with the actual ID of your recent entries section
    title: 'Recent Entries',
    content: 'View your most recent journal entries here, and easily access your coding journey.',
    placement: 'right',
  },
  {
    target: '#profile-link', // Example: Link to the profile page in the navbar
    title: 'Your Profile',
    content: 'Manage your profile, track your achievements, and connect with other developers.',
    placement: 'bottom',
  },
  {
    target: '#feed-link', // Example: Link to the feed page in the navbar
    title: 'Community Feed',
    content: 'Explore the latest journal entries from the ClubDev community and get inspired.',
    placement: 'bottom',
  },
]

export function GuidedTour() {
  const { data: session } = useSession()
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const { theme } = useTheme()
  const tourEnabled = process.env.NEXT_PUBLIC_TOUR_ENABLED === 'true';


  useEffect(() => {
    // Check if the user is new and has not seen the tour before
    if (session && !localStorage.getItem('guidedTourCompleted') && tourEnabled) {
      setRun(true)
    }
  }, [session, tourEnabled])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    } else if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem('guidedTourCompleted', 'true')
      setRun(false)
    }
  }

  // Dynamic styles based on the theme
  const tooltipStyles = {
    options: {
      arrowColor: theme === 'dark' ? '#111827' : '#f3f4f6',
      backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
      primaryColor: '#3b82f6',
      textColor: theme === 'dark' ? '#ffffff' : '#111827',
      zIndex: 1000,
    },
    tooltip: {
      borderRadius: 8,
    },
    tooltipContent: {
      padding: 16,
    },
    buttonNext: {
      backgroundColor: '#3b82f6',
      borderRadius: 8,
    },
    buttonBack: {
      color: '#3b82f6',
      borderRadius: 8,
    },
    buttonSkip: {
      color: '#3b82f6',
      borderRadius: 8,
    },
    // Add more styles here as needed
    beacon: { // Style the beacon
      display: 'flex', // Make the beacon a flex container
      justifyContent: 'center', // Center the content horizontally
      alignItems: 'center', // Center the content vertically
      width: 32, // Adjust the size as needed
      height: 32,
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    beaconInner: { // Style the beacon inner element
      display: 'none', // Hide the default beacon inner element
    },
    floater: { // Style the floater
      arrow: { // Style the floater arrow
        color: theme === 'dark' ? '#111827' : '#f3f4f6', // Match arrow color to tooltip background
      },
    },
  }

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run}
      continuous
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={tooltipStyles}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Last',
        next: 'Next',
        skip: 'Skip',
      }}
    />
  )
}