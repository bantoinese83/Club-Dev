import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Seo } from '@/components/Seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MindMapViewer } from '@/components/MindMapViewer'
import React from 'react';

async function getSharedMindMap(id: string) {
  const mindMap = await prisma.mindMap.findFirst({
    where: { id, isPublic: true },
  })
  return mindMap
}

export default async function SharedMindMapPage({ params }: { params: { id: string } }) {
  const mindMap = await getSharedMindMap(params.id)

  if (!mindMap) {
    notFound()
  }

  return (
    <>
      <Seo 
        title={`Shared Mind Map: ${mindMap.name}`}
        description={`View the shared mind map: ${mindMap.name}`}
      />
      <div className="container mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{mindMap.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <MindMapViewer content={mindMap.content} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

