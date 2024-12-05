import { prisma } from '@/lib/db'

export async function getRecommendedEntries(userId: string) {
  // Get user's interests based on their entries and likes
  const userInterests = await prisma.tag.findMany({
    where: {
      OR: [
        { entries: { some: { userId } } },
        { entries: { some: { likes: { some: { userId } } } } },
      ],
    },
    select: { name: true },
  })

  const interestNames = userInterests.map((tag: { name: string }) => tag.name)

  // Get recommended entries based on user's interests
  return await prisma.entry.findMany({
    where: {
      userId: { not: userId },
      tags: { some: { name: { in: interestNames } } },
    },
    include: {
      user: { select: { name: true, image: true } },
      tags: true,
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
}