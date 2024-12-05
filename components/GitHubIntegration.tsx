'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

type Repository = {
  id: number;
  name: string;
  full_name: string;
};

type Commit = {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
};

interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  githubAccessToken?: string | null;
}

interface ExtendedSession {
  user: ExtendedUser;
}

export function GitHubIntegration() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.githubAccessToken) {
      fetchRepositories();
    }
  }, [session]);

  const fetchRepositories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/github/repositories');
      if (!response.ok) throw new Error('Failed to fetch repositories');
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch GitHub repositories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommits = async (repo: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/github/commits?repo=${repo}`);
      if (!response.ok) throw new Error('Failed to fetch commits');
      const data = await response.json();
      setCommits(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch commits',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoChange = (repo: string) => {
    setSelectedRepo(repo);
    fetchCommits(repo);
  };

  if (!session?.user?.githubAccessToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connect your GitHub account to view repositories and recent commits.</p>
          <Button asChild className="mt-4">
            <a href="/api/auth/github">Connect GitHub</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedRepo} onValueChange={handleRepoChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a repository" />
          </SelectTrigger>
          <SelectContent>
            {repositories.map((repo) => (
              <SelectItem key={repo.id} value={repo.full_name}>
                {repo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && <p>Loading...</p>}
        {commits.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Recent Commits</h3>
            <ul className="space-y-2">
              {commits.map((commit) => (
                <li key={commit.sha} className="border-b pb-2">
                  <p className="font-medium">{commit.commit.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(commit.commit.author.date).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}