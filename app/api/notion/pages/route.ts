import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getNotionPages } from '@/lib/notion'

interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  notionAccessToken?: string | null;
}

export async function GET() {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const pages = await getNotionPages(session.user.notionAccessToken!)
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching Notion pages:', error)
    return NextResponse.json({ error: 'Failed to fetch Notion pages' }, { status: 500 })
  }
}