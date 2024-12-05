import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getRepositories } from '@/lib/github'
import { Session } from 'next-auth'

interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  githubAccessToken?: string | null
}

interface ExtendedSession extends Session {
  user: ExtendedUser
}

export async function GET() {
  const session = await getServerSession() as ExtendedSession
  if (!session || !session.user || !session.user.githubAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const repositories = await getRepositories(session.user.githubAccessToken)
    return NextResponse.json(repositories)
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}