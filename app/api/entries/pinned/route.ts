import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ExtendedSession {
  user: ExtendedUser;
}

export async function GET() {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const pinnedEntries = await prisma.entry.findMany({
      where: {
        userId: session.user.id,
        isPinned: true,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
        tags: true,
        likes: true,
        comments: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(pinnedEntries)
  } catch (error) {
    console.error('Error fetching pinned entries:', error)
    return NextResponse.json({ error: 'Failed to fetch pinned entries' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { entryId } = await req.json()

  try {
    const updatedEntry = await prisma.entry.update({
      where: {
        id: entryId,
        userId: session.user.id,
      },
      data: {
        isPinned: true,
      },
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error('Error pinning entry:', error)
    return NextResponse.json({ error: 'Failed to pin entry' }, { status: 500 })
  }
}