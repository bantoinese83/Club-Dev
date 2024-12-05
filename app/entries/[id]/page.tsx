import { prisma } from '@/lib/db'
import { Seo } from '@/components/Seo'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CommentSection } from '@/components/CommentSection'
import React from 'react';

async function getEntry(id: string) {
  return prisma.entry.findUnique({
    where: { id },
    include: {
      tags: true,
      user: {
        select: { name: true, image: true }
      },
      likes: true,
      comments: true,
    },
  })
}

export default async function EntryPage({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id)

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
            <div className="flex items-center space-x-2">
              <img src={entry.user.image || '/placeholder-avatar.png'} alt={entry.user.name} className="w-8 h-8 rounded-full" />
              <span className="text-sm text-muted-foreground">{entry.user.name}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: entry.content }} />
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag: { id: string, name: string }) => (
                <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <span>{entry.likes.length} likes</span>
              <span>{entry.comments.length} comments</span>
            </div>
          </CardContent>
        </Card>
        <CommentSection entryId={entry.id} />
      </div>
    </>
  )
}