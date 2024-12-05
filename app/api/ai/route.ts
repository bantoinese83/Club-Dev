import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getGeminiModel } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, action } = await req.json();

  const model = getGeminiModel();

  let prompt;
  if (action === 'suggest') {
    prompt = `Based on the following journal entry, suggest some topics or ideas for the user to explore or reflect on in their next entry:

${content}

Please provide 3-5 suggestions.`;
  } else if (action === 'summarize') {
    prompt = `Summarize the key points and insights from the following journal entry:

${content}

Please provide a concise summary in 3-5 bullet points.`;
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: 'Failed to generate AI content' }, { status: 500 });
  }
}

