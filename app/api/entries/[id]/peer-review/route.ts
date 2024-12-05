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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { rating, comment } = await req.json();

  try {
    const entry = await prisma.entry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const peerReview = await prisma.peerReview.create({
      data: {
        rating,
        comment,
        reviewerId: session.user.id,
        entryId: id,
        authorId: entry.userId,
      },
    });

    return NextResponse.json({ success: true, peerReview });
  } catch (error) {
    console.error('Error submitting peer review:', error);
    return NextResponse.json({ error: 'Failed to submit peer review' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession() as ExtendedSession | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const peerReviews = await prisma.peerReview.findMany({
      where: { entryId: id },
      include: { reviewer: { select: { name: true, image: true } } },
    });

    return NextResponse.json({ success: true, peerReviews });
  } catch (error) {
    console.error('Error fetching peer reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch peer reviews' }, { status: 500 });
  }
}