import {NextResponse} from 'next/server';
import {getServerSession} from 'next-auth/next';
import {prisma} from '@/lib/db';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ExtendedSession {
  user: ExtendedUser;
}

export async function POST(req: Request) {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, entryId } = await req.json();

  let pointsToAward = 0;
  switch (action) {
    case 'create_entry':
      pointsToAward = 10;
      break;
    case 'comment':
      pointsToAward = 5;
      break;
    case 'receive_like':
      pointsToAward = 2;
      break;
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: { increment: pointsToAward },
      },
      include: { badges: true },
    });

    // Optionally, you can use entryId here for additional logic
    if (entryId) {
      await prisma.entry.update({
        where: { id: entryId },
        data: { points: { increment: pointsToAward } },
      });
    }

    // Check for new achievements
    const newBadges = await checkForNewBadges(updatedUser);

    return NextResponse.json({ success: true, points: updatedUser.points, newBadges });
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json({ error: 'Failed to update points' }, { status: 500 });
  }
}

async function checkForNewBadges(user: any) {
  const newBadges = [];

  // Check for point-based badges
  if (user.points >= 100 && !user.badges.some((b: any) => b.name === 'Century')) {
    newBadges.push(await awardBadge(user.id, 'Century', 'Earned 100 points', '/badges/century.png'));
  }
  if (user.points >= 1000 && !user.badges.some((b: any) => b.name === 'Millennium')) {
    newBadges.push(await awardBadge(user.id, 'Millennium', 'Earned 1000 points', '/badges/millennium.png'));
  }

  // Add more badge checks here

  return newBadges;
}

async function awardBadge(userId: string, name: string, description: string, imageUrl: string) {
  return await prisma.badge.create({
    data: {
      name,
      description,
      imageUrl,
      users: {
        connect: {id: userId},
      },
    },
  });
}

export async function GET() {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true, badges: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}