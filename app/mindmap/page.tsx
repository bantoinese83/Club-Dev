import { Seo } from '@/components/Seo'
import { MindMapGeneratorWrapper } from '@/components/MindMapGenerator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react';

export default function MindMapPage() {
  return (
    <>
      <Seo 
        title="Mind Map Generator"
        description="Create and manage interactive mind maps"
      />
      <div className="container mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mind Map Generator</CardTitle>
            <CardDescription>Create and manage interactive mind maps</CardDescription>
          </CardHeader>
          <CardContent>
            <MindMapGeneratorWrapper />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

