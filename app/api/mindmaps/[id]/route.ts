import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const mindMap = await prisma.mindMap.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!mindMap) {
      return NextResponse.json({ error: 'Mind map not found' }, { status: 404 });
    }

    return NextResponse.json(mindMap);
  } catch (error) {
    console.error('Error fetching mind map:', error);
    return NextResponse.json({ error: 'Failed to fetch mind map' }, { status: 500 });
  }
}