import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { User } from 'next-auth';

interface ExtendedUser extends User {
  id: string;
}

export async function GET() {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const recentEntries = await prisma.entry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5, // Limit to 5 recent entries
      select: { id: true, title: true, createdAt: true }, // Select only necessary fields
    });

    return NextResponse.json(recentEntries);
  } catch (error) {
    console.error('Error fetching recent entries:', error);
    return NextResponse.json({ error: 'Failed to fetch recent entries' }, { status: 500 });
  }
}