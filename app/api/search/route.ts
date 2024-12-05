import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { searchEntries } from '@/lib/elasticsearch'

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET(req: Request) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const results = await searchEntries(query, session.user.id)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error searching entries:', error)
    return NextResponse.json({ error: 'Failed to search entries' }, { status: 500 })
  }
}