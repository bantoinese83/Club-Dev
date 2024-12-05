import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserAchievement {
  achievement: {
    id: string;
    name: string;
    description: string;
  };
}

export async function GET() {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      points: user.points,
      level: user.level,
      experiencePoints: user.experiencePoints,
      achievements: user.achievements.map((ua: UserAchievement) => ua.achievement),
    });
  } catch (error) {
    console.error('Error fetching user gamification data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}