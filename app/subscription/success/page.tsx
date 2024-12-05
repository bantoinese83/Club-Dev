'use client'
import React from 'react';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Here you could make an API call to verify the session and update the user's subscription status
      console.log('Verifying session:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="glassmorphism max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Subscription Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">Thank you for subscribing to ClubDev. Your account has been upgraded.</p>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

