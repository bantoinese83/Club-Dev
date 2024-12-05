import {NextResponse} from 'next/server';
import {getServerSession} from 'next-auth/next';
import {prisma} from '@/lib/db';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET(req: Request) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const sort = url.searchParams.get('sort') || 'recent';
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const whereClause: any = {
    userId: session.user.id,
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { tags: { some: { name: { contains: search, mode: 'insensitive' } } } },
    ],
  };

  if (category) {
    whereClause.categoryId = category;
  }

  const orderBy: any = {};
  if (sort === 'recent') {
    orderBy.createdAt = 'desc';
  } else if (sort === 'oldest') {
    orderBy.createdAt = 'asc';
  } else if (sort === 'title') {
    orderBy.title = 'asc';
  }

  try {
    const entries = await prisma.entry.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
      include: {
        tags: true,
        category: true,
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });

    const totalEntries = await prisma.entry.count({ where: whereClause });

    return new NextResponse(JSON.stringify({
      entries,
      totalPages: Math.ceil(totalEntries / limit),
      currentPage: page,
    }), {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, content, tags = [], categoryId, isVoiceNote = false } = await req.json()

  try {
    const entry = await prisma.entry.create({
      data: {
        title,
        content,
        userId: session.user.id,
        categoryId,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        isVoiceNote,
      },
      include: {
        tags: true,
        category: true,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error creating entry:', error)
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}