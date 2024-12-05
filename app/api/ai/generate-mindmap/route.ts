import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { generateMindMap } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { topic } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  try {
    const mindMap = await generateMindMap(topic);
    return NextResponse.json({ mindMap });
  } catch (error) {
    console.error('Error generating mind map:', error);
    return NextResponse.json({ error: 'Failed to generate mind map' }, { status: 500 });
  }
}

