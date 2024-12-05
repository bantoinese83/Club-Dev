'use client'
import React, {useState, useEffect} from 'react';
import {EntryCard} from '@/components/EntryCard';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {motion} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import {Seo} from '@/components/Seo';
import {useDebounce} from '@/hooks/useDebounce';
import {Search, TrendingUp, Clock, Users} from 'lucide-react';
import {AdvancedSearch} from '@/components/AdvancedSearch';
import {useAppContext} from '@/components/AppContext';

export default function PublicFeed() {
    const {entries} = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'following'>('recent');
    const [displayedEntries, setDisplayedEntries] = useState<typeof entries>([]);
    const [page, setPage] = useState(1);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const {ref, inView} = useInView({
        threshold: 0,
    });

    useEffect(() => {
        const fetchEntries = async () => {
            const response = await fetch(`/api/entries?sort=${sortBy}&search=${debouncedSearchQuery}&page=${page}`);
            const data = await response.json();
            setDisplayedEntries((prevEntries) => [...prevEntries, ...data]);
        };

        fetchEntries();
    }, [sortBy, debouncedSearchQuery, page]);

    useEffect(() => {
        if (inView) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView]);

    return (
        <>
            <Seo title="Public Feed" description="Explore journal entries from the ClubDev community."/>
            <div className="container mx-auto px-4 py-8">
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-foreground">Public Feed</h1>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                className={`flex items-center space-x-2 ${sortBy === 'recent' ? 'bg-primary text-white' : ''}`}
                                onClick={() => setSortBy('recent')}
                            >
                                <Clock className="w-4 h-4"/>
                                <span>Recent</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={`flex items-center space-x-2 ${sortBy === 'popular' ? 'bg-primary text-white' : ''}`}
                                onClick={() => setSortBy('popular')}
                            >
                                <TrendingUp className="w-4 h-4"/>
                                <span>Popular</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={`flex items-center space-x-2 ${sortBy === 'following' ? 'bg-primary text-white' : ''}`}
                                onClick={() => setSortBy('following')}
                            >
                                <Users className="w-4 h-4"/>
                                <span>Following</span>
                            </Button>
                        </div>
                    </div>
                    <div className="mb-6 relative">
                        <Input
                            type="search"
                            placeholder="Search entries..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                        <Button
                            variant="link"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                        >
                            {showAdvancedSearch ? 'Hide Advanced Search' : 'Advanced Search'}
                        </Button>
                    </div>
                    {showAdvancedSearch ? (
                        <AdvancedSearch/>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedEntries.map((entry) => (
                                <motion.div key={entry.id} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                                            transition={{duration: 0.5}}>
                                    <EntryCard entry={{
                                        ...entry,
                                        category: entry.category || null,
                                        _count: entry._count || {likes: 0, comments: 0}
                                    }}/>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    <div ref={ref} className="h-10"/>
                </motion.div>
            </div>
        </>
    );
}