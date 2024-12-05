import NextAuth, {User as NextAuthUser, Session as NextAuthSession} from 'next-auth'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {prisma} from '@/lib/db'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import {sendVerificationRequest} from '@/lib/email'

interface ExtendedUser extends NextAuthUser {
    id: string
    emailVerified?: boolean
}

interface ExtendedSession extends NextAuthSession {
    user: {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })
                if (!user || !user.password) {
                    return null
                }
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )
                if (!isPasswordValid) {
                    return null
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    emailVerified: user.emailVerified,
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = (user as ExtendedUser).id
            }
            return token
        },
        async session({session, token}) {
            if (session?.user) {
                (session as ExtendedSession).user.id = token.id as string
            }
            return session
        },
        async signIn({user, account}) {
            if (account?.provider === 'credentials' && !(user as ExtendedUser).emailVerified) {
                // Send verification email
                await sendVerificationRequest({
                    identifier: user.email,
                    url: 'http://localhost:3000/api/auth/verify-email',
                    provider: {server: '', from: ''}
                }) // Replace with your actual URL and provider details
                throw new Error('Please check your email to verify your account.')
            }
            return true
        },
    },
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request', // New page for verification request
    },
})

export {handler as GET, handler as POST}