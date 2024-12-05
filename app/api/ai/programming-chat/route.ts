import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getGeminiModel } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages } = await req.json();

  const model = getGeminiModel();

  const prompt = `You are an AI programming assistant. Please answer the following question or provide help with the given programming task. Here's the conversation history:

${messages.map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`).join('\n')}

Please provide a helpful and informative response.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error generating programming answer:', error);
    return NextResponse.json({ error: 'Failed to generate programming answer' }, { status: 500 });
  }
}

