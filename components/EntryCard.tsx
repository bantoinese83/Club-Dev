'use client'
import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ThumbsUp, MessageCircle, Share2, Edit, Trash} from 'lucide-react';
import {useSession} from 'next-auth/react';
import {DefaultSession} from 'next-auth';
import Link from 'next/link';
import {useWebSocket} from '@/components/WebSocketProvider';
import CodeSnippet from './CodeSnippet';
import {FlagButton} from './FlagButton';
import {ReputationBadge} from './ReputationBadge';
import Image from 'next/image';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {RichTextEditor} from '@/components/RichTextEditor';
import {useToast} from "@/hooks/use-toast";

interface CustomSession extends DefaultSession {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

interface EntryCardProps {
    entry: {
        id: string;
        title: string;
        content: string;
        createdAt: string;
        tags: { id: string; name: string }[];
        category: { id: string; name: string } | null;
        user: {
            id: string;
            name: string;
            image: string;
        };
        _count: {
            likes: number;
            comments: number;
        };
        codeSnippet?: string;
        codeLanguage?: string;
        isRecommended?: boolean;
        mediaUrl?: string;
        mediaType?: string;
    },
    onDelete?: () => Promise<void>
}

export function EntryCard({
                              entry,
                          }: EntryCardProps) {
    const {data: session} = useSession() as { data: CustomSession | null };
    const {toast} = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(entry.content);
    const {socket} = useWebSocket();

    const handleEdit = async () => {
        try {
            const response = await fetch(`/api/entries/${entry.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({content: editedContent}),
            });
            if (!response.ok) throw new Error('Failed to update entry');
            setIsEditing(false);
            toast({
                title: 'Success',
                description: 'Entry updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update entry',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = () => {
        if (socket) {
            socket.emit('deleteEntry', entry.id);
        } else {
            toast({
                title: 'Error',
                description: 'Socket connection is not available',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <Link href={`/entries/${entry.id}`} className="hover:underline">
                        {entry.title}
                    </Link>
                    {entry.isRecommended && (
                        <Badge variant="secondary">Recommended</Badge>
                    )}
                </CardTitle>
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={entry.user.image} alt={`${entry.user.name}'s profile picture`}/>
                        <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{entry.user.name}</span>
                    <ReputationBadge userId={entry.user.id}/>
                </div>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <RichTextEditor
                        initialContent={editedContent}
                        onSave={(content) => {
                            setEditedContent(content);
                            handleEdit();
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <p className="mb-2 text-muted-foreground">{entry.content}</p>
                )}
                {entry.mediaUrl && entry.mediaType && (
                    <div className="mb-4">
                        {entry.mediaType.startsWith('image/') ? (
                            <Image
                                src={entry.mediaUrl}
                                alt={`Image for ${entry.title}`}
                                width={300}
                                height={200}
                                layout="responsive"
                                loading="lazy"
                            />
                        ) : entry.mediaType.startsWith('video/') ? (
                            <video src={entry.mediaUrl} controls className="w-full"/>
                        ) : entry.mediaType.startsWith('audio/') ? (
                            <audio src={entry.mediaUrl} controls className="w-full"/>
                        ) : null}
                    </div>
                )}
                {entry.codeSnippet && entry.codeLanguage && (
                    <div className="mb-4">
                        <CodeSnippet code={entry.codeSnippet} language={entry.codeLanguage}/>
                    </div>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                    {entry.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                    ))}
                </div>
                {entry.category && (
                    <div className="mb-2">
                        <Badge variant="outline">{entry.category.name}</Badge>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-2"/>
                            {entry._count.likes}
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/entries/${entry.id}#comments`}>
                                <MessageCircle className="w-4 h-4 mr-2"/>
                                {entry._count.comments}
                            </Link>
                        </Button>
                        <FlagButton entryId={entry.id}/>
                    </div>
                    <div className="flex space-x-2">
                        {session?.user?.id === entry.user.id && (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4 mr-2"/>
                                    Edit
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <Trash className="w-4 h-4 mr-2"/>
                                            Delete
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you sure you want to delete this entry?</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline">Cancel</Button>
                                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                        <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4 mr-2"/>
                            Share
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}