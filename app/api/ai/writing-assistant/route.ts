import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getGeminiModel } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content } = await req.json();

  const model = getGeminiModel();

  const prompt = `As an AI writing assistant, please review and improve the following text. Provide suggestions for clarity, coherence, and style. If there are any grammatical errors, please correct them. Here's the text:

${content}

Please provide your suggestions and improvements in the following format:
1. Overall feedback
2. Specific suggestions (numbered list)
3. Improved version of the text`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating writing suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate writing suggestions' }, { status: 500 });
  }
}

