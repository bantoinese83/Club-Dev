import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  apiVersion: '2023-08-16', // Use the latest API version
  appInfo: {
    name: 'ClubDev',
    version: '1.0.0',
  },
});