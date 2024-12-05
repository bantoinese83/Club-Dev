import { prisma } from '@/lib/db'
import { Seo } from '@/components/Seo'
import { getServerSession } from 'next-auth/next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import React from 'react';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

async function getEntry(id: string, userId: string) {
  return prisma.entry.findFirst({
    where: { id, userId },
    include: { tags: true },
  })
}

export default async function EntryPage({ params }: { params: { id: string } }) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session?.user?.id) {
    notFound()
  }

  const entry = await getEntry(params.id, session.user.id)
  if (!entry) {
    notFound()
  }

  return (
    <>
      <Seo
        title={entry.title}
        description={`Journal entry: ${entry.title}`}
      />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{entry.title}</CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: entry.content }} />
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag: { id: string; name: string }) => (
                <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}