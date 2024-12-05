import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

interface CustomSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export async function GET() {
  const session: CustomSession | null = await getServerSession() as CustomSession | null;
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalEntries = await prisma.entry.count();
    const totalLikes = await prisma.like.count();
    const totalComments = await prisma.comment.count();
    const totalFollows = await prisma.follow.count();

    const topEntries = await prisma.entry.findMany({
      take: 5,
      orderBy: { likes: { _count: 'desc' } },
      include: {
        user: { select: { name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const mostActiveUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { entries: { _count: 'desc' } },
      include: {
        _count: { select: { entries: true, followers: true, following: true } },
      },
    });

    // User growth over the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Entry distribution by tags
    const entryDistribution = await prisma.tag.findMany({
      select: {
        name: true,
        _count: {
          select: {
            entries: true,
          },
        },
      },
      orderBy: {
        entries: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    // Calculate engagement rate
    const totalUsers30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const activeUsers30Days = await prisma.user.count({
      where: {
        OR: [
          {
            entries: {
              some: {
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            },
          },
          {
            likes: {
              some: {
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            },
          },
          {
            comments: {
              some: {
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            },
          },
        ],
      },
    });

    const engagementRate = activeUsers30Days / totalUsers30Days;

    let personalStats: any = null;
    if (session?.user?.id) {
      personalStats = await prisma.entry.aggregate({
        where: { userId: session.user.id },
        _avg: {
          contentLength: true,
        },
        _count: {
          id: true,
        },
        _sum: {
          likes: { _count: 'likes' },
          comments: { _count: 'comments' },
        },
      });

      const tagsUsed = await prisma.entry.findMany({
        where: { userId: session.user.id },
        include: { tags: true },
      }).then((entries: any[]) => {
        const tagCounts: { [tag: string]: number } = {};
        entries.forEach((entry: any) => {
          entry.tags.forEach((tag: any) => {
            tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
          });
        });
        return Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));
      });

      personalStats = {
        totalEntries: personalStats._count.id,
        totalLikesReceived: personalStats._sum.likes,
        totalCommentsReceived: personalStats._sum.comments,
        averageEntryLength: personalStats._avg.contentLength || 0,
        tagsUsed,
      };
    }

    return NextResponse.json({
      totalUsers,
      totalEntries,
      totalLikes,
      totalComments,
      totalFollows,
      topEntries,
      mostActiveUsers,
      userGrowth: userGrowth.map(({ createdAt, _count }: { createdAt: Date, _count: { id: number } }) => ({
        date: createdAt.toISOString().split('T')[0],
        count: _count.id,
      })),
      entryDistribution: entryDistribution.map(({ name, _count }: { name: string, _count: { entries: number } }) => ({
        category: name,
        count: _count.entries,
      })),
      engagementRate,
      personalStats,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}