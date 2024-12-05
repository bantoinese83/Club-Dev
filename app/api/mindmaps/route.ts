import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const mindMaps = await prisma.mindMap.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(mindMaps);
  } catch (error) {
    console.error('Error fetching mind maps:', error);
    return NextResponse.json({ error: 'Failed to fetch mind maps' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, nodes, edges } = await req.json();

  try {
    const mindMap = await prisma.mindMap.create({
      data: {
        name,
        content: JSON.stringify({ nodes, edges }),
        userId: session.user.id,
      },
    });
    return NextResponse.json(mindMap);
  } catch (error) {
    console.error('Error saving mind map:', error);
    return NextResponse.json({ error: 'Failed to save mind map' }, { status: 500 });
  }
}