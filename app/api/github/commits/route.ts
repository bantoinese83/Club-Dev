import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getRecentCommits } from '@/lib/github'

interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  githubAccessToken?: string | null;
}

export async function GET(req: Request) {
  const session = await getServerSession() as { user: ExtendedUser | null };
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const repo = searchParams.get('repo')

  if (!repo) {
    return NextResponse.json({ error: 'Repository is required' }, { status: 400 })
  }

  const [owner, repoName] = repo.split('/')

  try {
    const commits = await getRecentCommits(session.user.githubAccessToken!, repoName, owner)
    return NextResponse.json(commits)
  } catch (error) {
    console.error('Error fetching GitHub commits:', error)
    return NextResponse.json({ error: 'Failed to fetch commits' }, { status: 500 })
  }
}