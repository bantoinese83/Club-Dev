'use client'
import React from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  subscriptionStatus?: string | null;
  subscriptionTier?: string | null;
}

interface ExtendedSession {
  user: ExtendedUser;
}

export function SubscriptionStatus() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const router = useRouter();

  if (!session) {
    return <div>Loading...</div>;
  }

  const subscriptionStatus = session.user.subscriptionStatus;
  const subscriptionTier = session.user.subscriptionTier;

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="text-white">Subscription Status</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">
          Status: <span className="font-bold">{subscriptionStatus || 'Not subscribed'}</span>
        </p>
        {subscriptionTier && (
          <p className="text-gray-300 mt-2">
            Tier: <span className="font-bold">{subscriptionTier}</span>
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push('/subscription')} className="w-full">
          {subscriptionStatus === 'active' ? 'Manage Subscription' : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
}