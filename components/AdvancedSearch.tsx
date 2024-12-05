import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EntryCard } from '@/components/EntryCard';
import { useDebounce } from '@/hooks/useDebounce';
import React from 'react';

interface Entry {
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
}

interface TopicClusters {
  [key: string]: string[];
}

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Entry[]>([]);
  const [recommendations, setRecommendations] = useState<Entry[]>([]);
  const [topicClusters, setTopicClusters] = useState<TopicClusters>({});
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchSearchResults(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchRecommendations();
    fetchTopicClusters();
  }, []);

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data: Entry[] = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      if (response.ok) {
        const data: Entry[] = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchTopicClusters = async () => {
    try {
      const response = await fetch('/api/topic-clusters');
      if (response.ok) {
        const data: TopicClusters = await response.json();
        setTopicClusters(data);
      }
    } catch (error) {
      console.error('Error fetching topic clusters:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="mt-4 space-y-4">
            {searchResults.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((entry) => (
              <EntryCard key={entry.id} entry={{ ...entry, isRecommended: true }} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topic Clusters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(topicClusters).map(([topic, relatedTopics]) => (
              <div key={topic}>
                <h3 className="text-lg font-semibold">{topic}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {relatedTopics.map((relatedTopic: string) => (
                    <Button
                      key={relatedTopic}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(relatedTopic)}
                    >
                      {relatedTopic}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}