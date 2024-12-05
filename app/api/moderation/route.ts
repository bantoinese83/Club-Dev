import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

const SPAM_KEYWORDS = ['viagra', 'cialis', 'buy now', 'click here'];

function isSpam(content: string): boolean {
  const lowercaseContent = content.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lowercaseContent.includes(keyword));
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, commentId } = await req.json();

  if (isSpam(content)) {
    await prisma.comment.update({
      where: { id: commentId },
      data: { isHidden: true },
    });
    return NextResponse.json({ isSpam: true, action: 'hidden' });
  }

  return NextResponse.json({ isSpam: false });
}

