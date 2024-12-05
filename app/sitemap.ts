import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://clubdev.com'

  // Get all entries
  const entries = await prisma.entry.findMany({
    select: { id: true, updatedAt: true },
    where: { isPublic: true },
  })

  // Get all user profiles
  const users = await prisma.user.findMany({
    select: { id: true, updatedAt: true },
    where: { isPublic: true },
  })

  const entriesUrls = entries.map((entry) => ({
    url: `${baseUrl}/entries/${entry.id}`,
    lastModified: entry.updatedAt,
  }))

  const usersUrls = users.map((user) => ({
    url: `${baseUrl}/users/${user.id}`,
    lastModified: user.updatedAt,
  }))

  const staticPages = [
    '',
    '/about',
    '/journal',
    '/analytics',
    '/feed',
    '/prompts',
    '/code-assistant',
    '/mindmap',
    '/ai-assistance',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))

  return [...staticPages, ...entriesUrls, ...usersUrls]
}