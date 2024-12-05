// EntryList.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { EntryCard } from '@/components/EntryCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {Entry} from "@/app/types/types";

type EntryListProps = {
  initialSearchQuery: string;
  selectedCategory: string;
  entries?: Entry[];
};

export function EntryList({ initialSearchQuery, selectedCategory }: EntryListProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, [searchQuery, selectedCategory]);

  const fetchEntries = async () => {
    try {
      const response = await fetch(`/api/entries?search=${searchQuery}&category=${selectedCategory}&page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries((prevEntries) => [...prevEntries, ...data.entries]);
      setHasMore(data.currentPage < data.totalPages);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch entries',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/entries/${entryId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete entry');
      setEntries(entries.filter((entry) => entry.id !== entryId));
      toast({
        title: 'Success',
        description: 'Entry deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset page to 1 when search query changes
    setEntries([]); // Clear existing entries
    fetchEntries(); // Fetch new entries based on search query
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search entries..."
          className="input"
        />
        <Button type="submit">Search</Button>
      </form>
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} onDelete={() => handleDeleteEntry(entry.id)} />
      ))}
      {hasMore && (
        <Button onClick={fetchEntries} className="w-full">
          Load More
        </Button>
      )}
    </div>
  );
}