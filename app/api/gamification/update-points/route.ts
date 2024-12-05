import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function POST(req: Request) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, points } = await req.json();

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: { increment: points },
        activityLogs: {
          create: {
            action,
            points,
          },
        },
      },
      include: {
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    const allAchievements = await prisma.achievement.findMany();
    const newAchievements = allAchievements.filter(
      (achievement: { pointsRequired: number; id: string }) =>
        user.points >= achievement.pointsRequired &&
        !user.achievements.some((ua: { achievementId: string }) => ua.achievementId === achievement.id)
    );

    if (newAchievements.length > 0) {
      await prisma.userAchievement.createMany({
        data: newAchievements.map((achievement: { id: string }) => ({
          userId: user.id,
          achievementId: achievement.id,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      points: user.points,
      newAchievements,
    });
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json({ error: 'Failed to update points' }, { status: 500 });
  }
}