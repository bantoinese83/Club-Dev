'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, CheckCircle, Star, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const tiers = [
  {
    name: 'Free',
    price: 'free',
    features: [
      { icon: <CheckCircle className="w-4 h-4 mr-2" />, text: 'Basic journal entries' },
      { icon: <CheckCircle className="w-4 h-4 mr-2" />, text: 'Limited AI assistance' },
      { icon: <CheckCircle className="w-4 h-4 mr-2" />, text: 'Public feed access' },
    ],
  },
  {
    name: 'Pro',
    price: 'price_1NcXxXXXXXXXXXXXXXXXXXXX',
    features: [
      { icon: <Star className="w-4 h-4 mr-2" />, text: 'Unlimited journal entries' },
      { icon: <Star className="w-4 h-4 mr-2" />, text: 'Full AI assistance' },
      { icon: <Star className="w-4 h-4 mr-2" />, text: 'Code review' },
      { icon: <Star className="w-4 h-4 mr-2" />, text: 'Advanced analytics' },
    ],
  },
  {
    name: 'Enterprise',
    price: 'price_1NcXxYYYYYYYYYYYYYYYYYYY',
    features: [
      { icon: <Users className="w-4 h-4 mr-2" />, text: 'All Pro features' },
      { icon: <Users className="w-4 h-4 mr-2" />, text: 'Team collaboration' },
      { icon: <Shield className="w-4 h-4 mr-2" />, text: 'Priority support' },
      { icon: <Shield className="w-4 h-4 mr-2" />, text: 'Custom integrations' },
    ],
  },
];

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscription = async (priceId: string) => {
    if (priceId === 'free') {
      try {
        const response = await fetch('/api/subscription/downgrade', {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to downgrade subscription');
        toast({
          title: 'Success',
          description: 'Your subscription has been downgraded to the free tier.',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to downgrade subscription. Please try again.',
          variant: 'destructive',
        });
      }
      return;
    }

    setLoading(true);
    setSelectedTier(priceId);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setSelectedTier(null);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Please sign in to subscribe</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.name} className="glassmorphism">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">{tier.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold mb-4">{tier.price === 'free' ? 'Free' : `$${parseInt(tier.price.split('_')[1]) / 100}/month`}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.icon}
                    {feature.text}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscription(tier.price)}
                disabled={loading}
                className="w-full"
              >
                {loading && selectedTier === tier.price ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {loading && selectedTier === tier.price ? 'Processing...' : `Subscribe to ${tier.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}