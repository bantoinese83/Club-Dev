import { prisma } from '@/lib/db'

interface Tag {
  name: string;
  entries: Entry[];
}

interface Entry {
  tags: Tag[];
}

export async function getTopicClusters() {
  const tags: Tag[] = await prisma.tag.findMany({
    include: {
      entries: {
        include: {
          tags: true,
        },
      },
    },
  })

  const clusters: { [key: string]: string[] } = {}

  tags.forEach((tag: Tag) => {
    const relatedTags = new Set<string>()
    tag.entries.forEach((entry: Entry) => {
      entry.tags.forEach((relatedTag: Tag) => {
        if (relatedTag.name !== tag.name) {
          relatedTags.add(relatedTag.name)
        }
      })
    })
    clusters[tag.name] = Array.from(relatedTags)
  })

  return clusters
}