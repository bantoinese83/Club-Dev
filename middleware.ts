import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Check if the route requires a subscription
  const requiresSubscription = [
    '/ai-assistance',
    '/analytics',
    '/code-assistant',
    '/mindmap',
  ].some(path => request.nextUrl.pathname.startsWith(path))

  if (requiresSubscription) {
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { subscriptionTier: true, subscriptionStatus: true },
    })

    if (!user || user.subscriptionTier === 'free' || user.subscriptionStatus !== 'active') {
      return NextResponse.redirect(new URL('/subscription', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/ai-assistance/:path*',
    '/analytics/:path*',
    '/code-assistant/:path*',
    '/mindmap/:path*',
  ],
}

