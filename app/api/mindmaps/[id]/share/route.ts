import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { isPublic } = await req.json();

  try {
    const mindMap = await prisma.mindMap.update({
      where: { id, userId: session.user.id },
      data: { isPublic },
    });

    if (!mindMap) {
      return NextResponse.json({ error: 'Mind map not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, mindMap });
  } catch (error) {
    console.error('Error updating mind map:', error);
    return NextResponse.json({ error: 'Failed to update mind map' }, { status: 500 });
  }
}