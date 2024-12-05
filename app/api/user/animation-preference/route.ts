import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { User } from 'next-auth'

interface ExtendedUser extends User {
  id: string;
}

export async function GET() {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { reducedMotion: true },
  })

  return NextResponse.json({ reducedMotion: user?.reducedMotion || false })
}

export async function POST(req: Request) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { reducedMotion } = await req.json()

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { reducedMotion },
  })

  return NextResponse.json({ reducedMotion: updatedUser.reducedMotion })
}