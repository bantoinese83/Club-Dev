import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const reputation = await prisma.reputation.findUnique({
      where: { userId: id },
    });

    return NextResponse.json({ success: true, reputation });
  } catch (error) {
    console.error('Error fetching reputation:', error);
    return NextResponse.json({ error: 'Failed to fetch reputation' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { change } = await req.json();

  try {
    const reputation = await prisma.reputation.upsert({
      where: { userId: id },
      update: { score: { increment: change } },
      create: { userId: id, score: change },
    });

    return NextResponse.json({ success: true, reputation });
  } catch (error) {
    console.error('Error updating reputation:', error);
    return NextResponse.json({ error: 'Failed to update reputation' }, { status: 500 });
  }
}

