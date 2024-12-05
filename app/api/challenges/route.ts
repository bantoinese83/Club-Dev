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

  const challenges = await prisma.challenge.findMany({
    include: {
      participants: {
        where: { userId: session.user.id },
        select: {
          completed: true,
        },
      },
    },
  })

  return NextResponse.json(challenges)
}

export async function POST(req: Request) {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, description, startDate, endDate } = await req.json()

  const challenge = await prisma.challenge.create({
    data: {
      name,
      description,
      startDate,
      endDate
    }
  })

  return NextResponse.json(challenge)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: challengeId } = params
  const { completed } = await req.json()

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    const participant = await prisma.challengeParticipant.upsert({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId,
        },
      },
      update: { completed },
      create: {
        userId: session.user.id,
        challengeId,
        completed,
      },
    })

    return NextResponse.json({ success: true, participant })
  } catch (error) {
    console.error('Error updating challenge completion:', error)
    return NextResponse.json({ error: 'Failed to update challenge completion' }, { status: 500 })
  }
}