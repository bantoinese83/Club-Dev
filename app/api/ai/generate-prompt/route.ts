import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getGeminiModel } from '@/lib/ai';

export async function POST() {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const model = getGeminiModel();

  const prompt = `Generate a thought-provoking writing prompt for a developer's journal. The prompt should encourage reflection on recent coding experiences, challenges overcome, or goals for future projects. Please provide a single, concise prompt.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedPrompt = response.text();

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}

