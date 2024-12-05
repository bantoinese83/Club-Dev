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

  const prompt = messages.map((msg: { role: string; content: string }) => {
    return `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`;
  }).join('\n') + '\nAssistant:';

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    return NextResponse.json({ error: 'Failed to generate chatbot response' }, { status: 500 });
  }
}

