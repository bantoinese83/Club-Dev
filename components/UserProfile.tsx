import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"
import { Input } from '@/components/ui/input'
import { GithubIcon as GithubLogo, LinkedinIcon as LinkedinLogo, TwitterIcon as TwitterLogo, Globe } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import React from 'react';
import {DefaultSession} from "next-auth";

interface UserProfileProps {
  user: {
    id: string
    name: string
    image: string
    bio: string | null
    followersCount: number
    followingCount: number
    isFollowing: boolean
    subscriptionTier: string
    subscriptionStatus: string
    skills: string[] | null
    github?: string | null
    twitter?: string | null
    linkedin?: string | null
    website?: string | null
  }
}

interface CustomSession extends DefaultSession {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const { data: session } = useSession() as { data: CustomSession | null }
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [followersCount, setFollowersCount] = useState(user.followersCount)
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(user.bio || '')
  const [skills, setSkills] = useState<string[]>(user.skills || [])
  const [github, setGithub] = useState(user.github || '')
  const [twitter, setTwitter] = useState(user.twitter || '')
  const [linkedin, setLinkedin] = useState(user.linkedin || '')
  const [website, setWebsite] = useState(user.website || '')

  const handleFollow = async () => {
    if (!session || !session.user) {
      toast({
        title: "Error",
        description: "You must be signed in to follow users.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/users/${user.id}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to follow/unfollow user')
      }

      setIsFollowing(!isFollowing)
      setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow/unfollow user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, skills, github, twitter, linkedin, website }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            {isEditing ? (
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter your bio"
                className="mt-2"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{user.bio || 'No bio yet.'}</p>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-medium">Followers</p>
            <p className="text-2xl font-bold">{followersCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Following</p>
            <p className="text-2xl font-bold">{user.followingCount}</p>
          </div>
          {session && session.user && session.user.id !== user.id && (
            <Button onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">Subscription</p>
          <p className="text-lg">{user.subscriptionTier} - {user.subscriptionStatus}</p>
          {user.subscriptionTier === 'free' && (
            <Button asChild className="mt-2">
              <Link href="/subscription">Upgrade Subscription</Link>
            </Button>
          )}
        </div>
        {isEditing ? (
          <div className="mt-4 space-y-2">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills (comma-separated)
              </label>
              <Input
                type="text"
                name="skills"
                id="skills"
                value={skills.join(',')}
                onChange={(e) => setSkills(e.target.value.split(','))}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                GitHub
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <GithubLogo className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  type="text"
                  name="github"
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="block w-full pl-10 focus:ring-primary focus:border-primary border-input rounded-md sm:text-sm"
                  placeholder="your-github-username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                Twitter
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <TwitterLogo className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  type="text"
                  name="twitter"
                  id="twitter"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="block w-full pl-10 focus:ring-primary focus:border-primary border-input rounded-md sm:text-sm"
                  placeholder="your-twitter-username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LinkedinLogo className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  type="text"
                  name="linkedin"
                  id="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="block w-full pl-10 focus:ring-primary focus:border-primary border-input rounded-md sm:text-sm"
                  placeholder="your-linkedin-username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  type="text"
                  name="website"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="block w-full pl-10 focus:ring-primary focus:border-primary border-input rounded-md sm:text-sm"
                  placeholder="your-website-url"
                />
              </div>
            </div>
            <Button onClick={handleSaveProfile} className="mt-4">Save Profile</Button>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {user.skills && user.skills.length > 0 && (
              <div>
                <p className="text-sm font-medium">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {user.github && (
              <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <GithubLogo className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-700">{user.github}</p>
              </a>
            )}
            {user.twitter && (
              <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <TwitterLogo className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-700">{user.twitter}</p>
              </a>
            )}
            {user.linkedin && (
              <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <LinkedinLogo className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-700">{user.linkedin}</p>
              </a>
            )}
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-700">{user.website}</p>
              </a>
            )}
            {session && session.user && session.user.id === user.id && (
              <Button onClick={() => setIsEditing(true)} className="mt-4">Edit Profile</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}