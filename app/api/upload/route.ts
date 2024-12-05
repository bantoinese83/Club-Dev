import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { uploadToS3 } from '@/lib/s3';
import { User } from 'next-auth';

interface ExtendedUser extends User {
  id: string;
}

export async function POST(req: Request) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${session.user.id}/${Date.now()}-${file.name}`;
    const contentType = file.type;

    const fileUrl = await uploadToS3(buffer, fileName, contentType);

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}