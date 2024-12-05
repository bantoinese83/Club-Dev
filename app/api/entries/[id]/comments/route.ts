import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { io } from '@/server/websocket';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const comments = await prisma.comment.findMany({
      where: { entryId: id, isHidden: false },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
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
  const { content } = await req.json();

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        entryId: id,
      },
      include: { user: { select: { name: true, image: true } } },
    });

    // Check for spam
    const moderationResponse = await fetch('/api/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, commentId: comment.id }),
    });

    const moderationResult = await moderationResponse.json();

    if (moderationResult.isSpam) {
      return NextResponse.json({ error: 'Comment flagged as spam' }, { status: 400 });
    }

    // Emit WebSocket event
    io.to(`entry:${id}`).emit('newComment', comment);

    // Create notification for entry owner
    const entry = await prisma.entry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (entry && entry.userId !== session.user.id) {
      const notification = await prisma.notification.create({
        data: {
          userId: entry.userId,
          type: 'comment',
          message: `${session.user.name} commented on your entry`,
        },
      });

      io.to(`user:${entry.userId}`).emit('newNotification', notification);
    }

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}