import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IntegrationSelectorsProps {
  session: any; // Replace 'any' with your actual session type
  repositories: any[]; // Replace 'any[]' with your actual repo type
  setRepositories: React.Dispatch<React.SetStateAction<any[]>>; //Replace 'any[]' with your actual repo type
  selectedRepo: string;
  setSelectedRepo: React.Dispatch<React.SetStateAction<string>>;
  notionPages: any[]; // Replace 'any[]' with your actual Notion page type
  setNotionPages: React.Dispatch<React.SetStateAction<any[]>>; //Replace 'any[]' with your actual Notion page type
  selectedNotionPage: string;
  setSelectedNotionPage: React.Dispatch<React.SetStateAction<string>>;
}


export default function IntegrationSelectors({ session, repositories,
                                                 selectedRepo, setSelectedRepo, notionPages,
                                                 selectedNotionPage, setSelectedNotionPage }: IntegrationSelectorsProps) {
    return (
        <>
            {session && session.user.githubAccessToken && (
                <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select GitHub Repo" />
                    </SelectTrigger>
                    <SelectContent>
                        {repositories.map((repo) => (
                            <SelectItem key={repo.id} value={repo.full_name}>
                                {repo.full_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {session && session.user.notionAccessToken && (
                <Select value={selectedNotionPage} onValueChange={setSelectedNotionPage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Notion Page" />
                    </SelectTrigger>
                    <SelectContent>
                        {notionPages.map((page) => (
                            <SelectItem key={page.id} value={page.id}>
                                {page.properties.title.title[0].plain_text}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </>
    )
}