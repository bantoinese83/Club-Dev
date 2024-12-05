import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(session);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(session.customer as string);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(session.customer as string);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('No userId found in session metadata');
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'ACTIVE', // Use the correct enum value
    },
  });
}

async function handleSubscriptionUpdated(stripeCustomerId: string) {
  const subscription = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: 'active',
    expand: ['data.items.plan.product'],
  });

  if (subscription.data.length === 0) {
    console.error('No active subscription found for customer', stripeCustomerId);
    return;
  }

  const subscriptionData = subscription.data[0];
  const planProduct = subscriptionData.items.data[0].plan.product as Stripe.Product;

  let subscriptionTier = 'FREE'; // Default to the correct enum value
  if (planProduct.name.toLowerCase().includes('pro')) {
    subscriptionTier = 'PRO';
  } else if (planProduct.name.toLowerCase().includes('enterprise')) {
    subscriptionTier = 'ENTERPRISE';
  }

  await prisma.user.update({
    where: { stripeCustomerId },
    data: {
      subscriptionStatus: subscriptionData.status.toUpperCase() as any, // Convert status to enum value
      subscriptionTier: subscriptionTier as any, // Use the correct enum value
      subscriptionEndDate: new Date(subscriptionData.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(stripeCustomerId: string) {
  await prisma.user.update({
    where: { stripeCustomerId },
    data: {
      subscriptionStatus: 'INACTIVE', // Use the correct enum value
      subscriptionTier: 'FREE', // Use the correct enum value
      subscriptionEndDate: null,
    },
  });
}