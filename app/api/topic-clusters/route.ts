import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getTopicClusters } from '@/lib/topicClustering'

export async function GET() {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const clusters = await getTopicClusters()
    return NextResponse.json(clusters)
  } catch (error) {
    console.error('Error fetching topic clusters:', error)
    return NextResponse.json({ error: 'Failed to fetch topic clusters' }, { status: 500 })
  }
}

