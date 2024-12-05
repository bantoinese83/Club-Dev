'use client'
import React, {useState, useEffect, Suspense, useCallback} from 'react';
import dynamic from 'next/dynamic';
import {Sidebar} from '@/components/Sidebar';
import {Seo} from '@/components/Seo';
import {Calendar} from '@/components/ui/calendar';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {motion, AnimatePresence} from 'framer-motion';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useAnimation} from '@/contexts/AnimationContext';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {EntryList} from '@/components/EntryList';
import {CategoryManager} from '@/components/CategoryManager';
import {toast} from '@/hooks/use-toast';
import {Entry} from "@/app/types/types";
import {StreakChallenge} from '@/components/StreakChallenge';
import {UserProgress} from '@/components/UserProgress';
import {RichTextEditorProvider} from '@/contexts/RichTextEditorContext';

type Category = {
    id: string;
    name: string;
    _count: { entries: number };
};

interface ExtendedUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface ExtendedSession {
    user: ExtendedUser;
}

interface RichTextEditorProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    onCancel: () => void;
}

const RichTextEditor = dynamic<RichTextEditorProps>(() => import('@/components/RichTextEditor').then(mod => mod.RichTextEditor), {
    loading: () => <p>Loading editor...</p>,
});

export default function JournalPage() {
    const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const {data: session} = useSession() as { data: ExtendedSession | null };
    const {reducedMotion} = useAnimation();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchRecentEntries = async () => {
        try {
            const response = await fetch('/api/entries/recent');
            if (!response.ok) throw new Error('Failed to fetch recent entries');
            const data = await response.json();
            setRecentEntries(data.entries);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch recent entries',
                variant: 'destructive',
            });
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch categories',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchRecentEntries();
            fetchCategories();
        }
    }, [session]);

    const fetchEntries = useCallback(
        async (newSearchQuery = searchQuery, newSelectedCategory = selectedCategory, newPage = page) => {
            try {
                const response = await fetch(`/api/entries?search=${newSearchQuery}&category=${newSelectedCategory}&page=${newPage}`);
                if (!response.ok) throw new Error('Failed to fetch entries');
                const data = await response.json();

                if (newPage === 1) {
                    setEntries(data.entries);
                } else {
                    setEntries((prevEntries) => [...prevEntries, ...data.entries]);
                }

                setHasMore(data.currentPage < data.totalPages);
                setPage(data.currentPage + 1);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch entries',
                    variant: 'destructive',
                });
            }
        },
        [searchQuery, selectedCategory, page, toast]
    );

    useEffect(() => {
        if (session?.user?.id) {
            fetchEntries(searchQuery, selectedCategory, 1);
        }
    }, [session, fetchEntries, searchQuery, selectedCategory]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchEntries(searchQuery, selectedCategory, 1);
        setPage(1);
    };

    return (
        <>
            <Seo title="Journal"
                 description="Log your daily coding achievements and reflections in your developer journal."/>
            <motion.div
                className="container mx-auto px-4 py-8"
                initial={reducedMotion ? false : {opacity: 0}}
                animate={reducedMotion ? undefined : {opacity: 1}}
                transition={reducedMotion ? undefined : {duration: 0.5}}
            >
                <div className="flex flex-col lg:flex-row gap-8">
                    <motion.div
                        className="flex-grow"
                        initial={reducedMotion ? false : {x: -20, opacity: 0}}
                        animate={reducedMotion ? undefined : {x: 0, opacity: 1}}
                        transition={reducedMotion ? undefined : {duration: 0.5, delay: 0.2}}
                    >
                        <motion.h1
                            className="text-3xl font-bold mb-6 text-foreground"
                            initial={reducedMotion ? false : {y: -20}}
                            animate={reducedMotion ? undefined : {y: 0}}
                            transition={reducedMotion ? undefined : {delay: 0.4, type: 'spring', stiffness: 120}}
                        >
                            Journal
                        </motion.h1>

                        <motion.div
                            initial={reducedMotion ? false : {y: 20, opacity: 0}}
                            animate={reducedMotion ? undefined : {y: 0, opacity: 1}}
                            transition={reducedMotion ? undefined : {delay: 0.6, duration: 0.5}}
                        >
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>New Entry</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Suspense fallback={<p>Loading...</p>}>
                                        <RichTextEditorProvider
                                            onSave={async (content: string) => {
                                                try {
                                                    const response = await fetch('/api/entries', {
                                                        method: 'POST',
                                                        headers: {'Content-Type': 'application/json'},
                                                        body: JSON.stringify({
                                                            title: 'New Entry',
                                                            content,
                                                            tags: [],
                                                            categoryId: null,
                                                        }),
                                                    });
                                                    if (!response.ok) throw new Error('Failed to save entry');
                                                    toast({
                                                        title: 'Success',
                                                        description: 'Entry saved successfully',
                                                    });
                                                    fetchRecentEntries();
                                                    fetchEntries(searchQuery, selectedCategory, 1);
                                                } catch (error) {
                                                    toast({
                                                        title: 'Error',
                                                        description: 'Failed to save entry',
                                                        variant: 'destructive',
                                                    });
                                                }
                                            }}
                                            onCancel={() => {
                                                // Do nothing
                                            }}
                                        >
                                            <RichTextEditor initialContent=""
                                                            onSave={function (content: string): Promise<void> {
                                                                throw new Error('Function not implemented.');
                                                            }} onCancel={function (): void {
                                                throw new Error('Function not implemented.');
                                            }}/>
                                        </RichTextEditorProvider>
                                    </Suspense>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={reducedMotion ? false : {y: 20, opacity: 0}}
                            animate={reducedMotion ? undefined : {y: 0, opacity: 1}}
                            transition={reducedMotion ? undefined : {delay: 0.8, duration: 0.5}}
                        >
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Entries</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
                                        <Input
                                            type="text"
                                            placeholder="Search entries..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Categories"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All Categories</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name} ({category._count.entries})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="submit">Search</Button>
                                    </form>
                                    <EntryList
                                        entries={entries}
                                        initialSearchQuery={searchQuery}
                                        selectedCategory={selectedCategory}
                                    />
                                    {hasMore && (
                                        <Button onClick={() => fetchEntries(searchQuery, selectedCategory, page)}
                                                className="w-full mt-4">
                                            Load More
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={reducedMotion ? false : {y: 20, opacity: 0}}
                            animate={reducedMotion ? undefined : {y: 0, opacity: 1}}
                            transition={reducedMotion ? undefined : {delay: 1.4, duration: 0.5}}
                        >
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Recent Entries</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div id="recent-entries" className="space-y-4">
                                        <AnimatePresence>
                                            {recentEntries.map((entry, index) => (
                                                <motion.div
                                                    key={entry.id}
                                                    initial={reducedMotion ? false : {opacity: 0, y: 20}}
                                                    animate={reducedMotion ? undefined : {opacity: 1, y: 0}}
                                                    exit={reducedMotion ? undefined : {opacity: 0, y: -20}}
                                                    transition={reducedMotion ? undefined : {delay: index * 0.1}}
                                                >
                                                    <Link href={`/journal/${entry.id}`} className="block mb-2">
                                                        <span
                                                            className="text-primary hover:underline">{entry.title}</span>
                                                        <p className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</p>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="lg:w-1/3"
                        initial={reducedMotion ? false : {x: 20, opacity: 0}}
                        animate={reducedMotion ? undefined : {x: 0, opacity: 1}}
                        transition={reducedMotion ? undefined : {duration: 0.5, delay: 0.4}}
                    >
                        <Sidebar/>
                        <motion.div
                            initial={reducedMotion ? false : {y: 20, opacity: 0}}
                            animate={reducedMotion ? undefined : {y: 0, opacity: 1}}
                            transition={reducedMotion ? undefined : {delay: 1, duration: 0.5}}
                        >
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Calendar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Calendar/>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div
                            initial={reducedMotion ? false : {y: 20, opacity: 0}}
                            animate={reducedMotion ? undefined : {y: 0, opacity: 1}}
                            transition={reducedMotion ? undefined : {delay: 1.2, duration: 0.5}}
                        >
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Categories</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CategoryManager categories={categories} onCategoryAdded={fetchCategories}/>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div
                            initial={reducedMotion ? false : {y: 20, opacity: 0}}
                            animate={reducedMotion ? undefined : {y: 0, opacity: 1}}
                            transition={reducedMotion ? undefined : {delay: 1.4, duration: 0.5}}
                        >
                            <StreakChallenge/>
                            <UserProgress/>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}