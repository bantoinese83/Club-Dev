import {NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'
import {prisma} from '@/lib/db'

interface CustomSession {
    user: {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export async function GET() {
    const session: CustomSession | null = await getServerSession() as CustomSession | null
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const achievements = await prisma.userAchievement.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            achievement: true
        }
    })

    return NextResponse.json(achievements)
}