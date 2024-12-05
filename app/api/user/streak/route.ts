import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET() {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { currentStreak: true, longestStreak: true },
    });
    return NextResponse.json({ currentStreak: user?.currentStreak || 0, longestStreak: user?.longestStreak || 0 });
  } catch (error) {
    console.error('Error fetching user streak:', error);
    return NextResponse.json({ error: 'Failed to fetch user streak' }, { status: 500 });
  }
}

export async function POST() {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { currentStreak: true, longestStreak: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        currentStreak: { increment: 1 },
        longestStreak: { set: Math.max(user?.longestStreak || 0, (user?.currentStreak || 0) + 1) },
      },
    });

    return NextResponse.json({ currentStreak: updatedUser.currentStreak, longestStreak: updatedUser.longestStreak });
  } catch (error) {
    console.error('Error updating user streak:', error);
    return NextResponse.json({ error: 'Failed to update user streak' }, { status: 500 });
  }
}