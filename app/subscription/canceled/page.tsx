'use client'
import React from 'react';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SubscriptionCanceledPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="glassmorphism max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Subscription Canceled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">Your subscription process was canceled. If this was a mistake, you can try again.</p>
          <Button onClick={() => router.push('/subscription')} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

