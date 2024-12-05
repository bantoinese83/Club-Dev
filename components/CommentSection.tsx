import {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {useToast} from "@/hooks/use-toast";
import React from "react";

interface Comment {
    id: string
    content: string
    createdAt: string
    user: {
        name: string
        image: string
    }
}

interface CommentSectionProps {
    entryId: string
}

export function CommentSection({entryId}: CommentSectionProps) {
    const {data: session} = useSession()
    const {toast} = useToast()
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')

    useEffect(() => {
        fetchComments()
    }, [entryId])

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/entries/${entryId}/comments`)
            if (!response.ok) {
                throw new Error('Failed to fetch comments')
            }
            const data = await response.json()
            setComments(data)
        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session) {
            toast({
                title: "Error",
                description: "You must be signed in to comment.",
                variant: "destructive",
            })
            return
        }

        try {
            const response = await fetch(`/api/entries/${entryId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({content: newComment}),
            })

            if (!response.ok) {
                throw new Error('Failed to post comment')
            }

            const data = await response.json()
            setComments([data.comment, ...comments])
            setNewComment('')
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to post comment. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Comments</h3>
            {session && (
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="mb-2"
                    />
                    <Button type="submit">Post Comment</Button>
                </form>
            )}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                        <Avatar>
                            <AvatarImage src={comment.user.image} alt={comment.user.name}/>
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
              clear          <div>
                            <p className="font-medium">{comment.user.name}</p>
                            <p className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                            <p className="mt-1">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

