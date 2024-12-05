import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getGeminiModel } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt, language } = await req.json();

  const model = getGeminiModel();

  const fullPrompt = `Generate ${language} code for the following request:

${prompt}

Please provide only the code without any additional explanation.`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const code = response.text();

    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}

