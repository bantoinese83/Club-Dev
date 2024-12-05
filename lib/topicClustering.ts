import { prisma } from '@/lib/db'

interface Tag {
  id: string;
  name: string;
  entries: Entry[];
}

interface Entry {
  id: string;
  title: string;
  content: string;
  codeSnippet: string | null;
  codeLanguage: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  tags: Tag[];
}

export async function getTopicClusters() {
  const tags = await prisma.tag.findMany({
    include: {
      entries: {
        include: {
          tags: true,
        },
      },
    },
  });

  const clusters: { [key: string]: string[] } = {};

  tags.forEach((tag) => {
    const relatedTags = new Set<string>();
    tag.entries.forEach((entry) => {
      entry.tags.forEach((relatedTag) => {
        if (relatedTag.name !== tag.name) {
          relatedTags.add(relatedTag.name);
        }
      });
    });
    clusters[tag.name] = Array.from(relatedTags);
  });

  return clusters;
}