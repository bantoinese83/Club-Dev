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
  const { reason } = await req.json();

  try {
    const flag = await prisma.flag.create({
      data: {
        reason,
        userId: session.user.id,
        entryId: id,
      },
    });

    return NextResponse.json({ success: true, flag });
  } catch (error) {
    console.error('Error flagging entry:', error);
    return NextResponse.json({ error: 'Failed to flag entry' }, { status: 500 });
  }
}