import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE!,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!,
  },
})

interface Entry {
  id: string
  title: string
  content: string
  tags: { name: string }[]
  userId: string
  createdAt: string
}

export async function indexEntry(entry: Entry) {
  await client.index({
    index: 'entries',
    id: entry.id,
    document: {
      title: entry.title,
      content: entry.content,
      tags: entry.tags.map(tag => tag.name),
      authorId: entry.userId,
      createdAt: entry.createdAt,
    },
  })
}

interface SearchResult {
  id: string
  title: string
  content: string
  tags: string[]
  authorId: string
  createdAt: string
}

export async function searchEntries(query: string, userId: string): Promise<SearchResult[]> {
  const result = await client.search({
    index: 'entries',
    body: {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title', 'content', 'tags'],
              },
            },
          ],
          should: [
            {
              term: {
                authorId: userId,
              },
            },
          ],
        },
      },
    },
  })

  return result.hits.hits.map(hit => {
    const source = hit._source as SearchResult
    return {
      id: hit._id as string, // Ensure id is always a string
      title: source.title,
      content: source.content,
      tags: source.tags,
      authorId: source.authorId,
      createdAt: source.createdAt,
    }
  })
}