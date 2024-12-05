import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getGeminiModel } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { code, language } = await req.json();

  const model = getGeminiModel();

  const prompt = `As an AI code reviewer, please review the following ${language} code and provide suggestions for improvements, best practices, and potential issues. Here's the code:

${code}

Please provide your review in the following format:
1. Overall assessment
2. Code quality (1-10 scale)
3. Specific suggestions (numbered list)
4. Improved version of the code (if applicable)`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const review = response.text();

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error generating code review:', error);
    return NextResponse.json({ error: 'Failed to generate code review' }, { status: 500 });
  }
}

