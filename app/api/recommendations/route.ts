import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getRecommendedEntries } from '@/lib/recommendations'
import { User } from 'next-auth'

interface ExtendedUser extends User {
  id: string;
}

export async function GET() {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const recommendations = await getRecommendedEntries(session.user.id)
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}