import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { io } from '@/server/websocket';
import { User } from 'next-auth';

interface ExtendedUser extends User {
  id: string;
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

  try {
    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        entryId: id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Emit WebSocket event
    io.to(`entry:${id}`).emit('newLike', like);

    // Create notification for entry owner
    const entry = await prisma.entry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (entry && entry.userId !== session.user.id) {
      const notification = await prisma.notification.create({
        data: {
          userId: entry.userId,
          type: 'like',
          message: `${session.user.name} liked your entry`,
        },
      });

      io.to(`user:${entry.userId}`).emit('newNotification', notification);
    }

    return NextResponse.json({ success: true, like });
  } catch (error) {
    console.error('Error liking entry:', error);
    return NextResponse.json({ error: 'Failed to like entry' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.like.delete({
      where: {
        userId_entryId: {
          userId: session.user.id,
          entryId: id,
        },
      },
    });

    // Emit WebSocket event
    io.to(`entry:${id}`).emit('removeLike', { userId: session.user.id, entryId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unliking entry:', error);
    return NextResponse.json({ error: 'Failed to unlike entry' }, { status: 500 });
  }
}