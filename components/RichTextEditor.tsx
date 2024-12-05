// RichTextEditor.tsx
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/components/AppContext';
import Toolbar from './Toolbar';
import Editor from './Editor';
import TagList from './TagList';
import IntegrationSelectors from './IntegrationSelectors';
import AIControls from './AIControls';
import CodeEditorSection from './CodeEditorSection';
import { getGitHubClient } from "@/lib/github";
import { createGitHubIssue } from "@/lib/integrations";
import { createNotionPage, getNotionClient } from "@/lib/notion";
import { User } from "next-auth";
import { Session } from "next-auth";
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {checkAndUnlockAchievements} from "@/lib/achievements";

dynamic<FileUploadProps>(() => import('./FileUpload').then(mod => mod.FileUpload), { ssr: false });
dynamic<EmbedProps>(() => import('./Embed').then(mod => mod.Embed), { ssr: false });

interface FileUploadProps {
  onUploadComplete: (fileUrl: string, fileType: string) => void;
}

interface EmbedProps {
  onEmbed: (url: string) => void;
}

interface ExtendedUser extends User {
  githubAccessToken?: string | null;
  notionAccessToken?: string | null;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

interface Repository {
  id: number;
  full_name: string;
}

interface RichTextEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export function RichTextEditor({ initialContent = '', onSave, onCancel }: RichTextEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [selectedNotionPage, setSelectedNotionPage] = useState<string>('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isReviewingCode, setIsReviewingCode] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [notionPages, setNotionPages] = useState<PageObjectResponse[]>([]);
  const { toast } = useToast();
  const { fetchEntries } = useAppContext();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession() as { data: ExtendedSession | null };

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSaveEntry = async () => {
    if (!title) {
      toast({
        title: 'Error',
        description: 'Please enter a title for your entry.',
        variant: 'destructive',
      });
      return;
    }

    try {
      let githubIssueUrl = null;
      let notionPageId = null;

      if (selectedRepo) {
        const [owner, repo] = selectedRepo.split('/');
        const github = getGitHubClient(session!.user.githubAccessToken!);
        const issue = await createGitHubIssue(github, owner, repo, title, content);
        githubIssueUrl = issue.data.html_url;
      }

      if (selectedNotionPage) {
        const page = await createNotionPage(session!.user.notionAccessToken!, title, content);
        notionPageId = page.id;
      }

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags,
          categoryId: null,
          githubIssueUrl,
          notionPageId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save entry');
      }

      // Check and unlock achievements
      await checkAndUnlockAchievements(session!.user.id);

      toast({
        title: 'Success',
        description: 'Entry saved successfully',
      });
      fetchEntries();
      onSave(content);

      setTitle('');
      setContent('');
      setTags([]);
      setSelectedRepo('');
      setSelectedNotionPage('');
      setShowCodeEditor(false);
      setCodeSnippet('');
    } catch (error: any) {
      console.error('Error saving entry:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save entry. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAIAction = async (action: 'suggest' | 'summarize') => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, action }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform AI action');
      }

      const data = await response.json();
      setContent(data.result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform AI action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const applyStyle = (style: string, arg?: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const span = document.createElement('span');

      switch (style) {
        case 'bold':
          span.style.fontWeight = 'bold';
          break;
        case 'italic':
          span.style.fontStyle = 'italic';
          break;
        case 'underline':
          span.style.textDecoration = 'underline';
          break;
        case 'formatBlock':
          if (arg) {
            const block = document.createElement(arg);
            block.appendChild(selectedText);
            range.insertNode(block);
          }
          return;
        default:
          return;
      }

      span.appendChild(selectedText);
      range.insertNode(span);
      setContent(editorRef.current.innerHTML);
    }
  };

  const toggleCodeEditor = () => {
    setShowCodeEditor(!showCodeEditor);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const { fileUrl } = await response.json();

      if (file.type.startsWith('image/')) {
        applyStyle('insertImage', fileUrl);
      } else if (file.type.startsWith('video/')) {
        const videoTag = `<video src="${fileUrl}" controls width="100%"></video>`;
        applyStyle('insertHTML', videoTag);
      } else if (file.type.startsWith('audio/')) {
        const audioTag = `<audio src="${fileUrl}" controls></audio>`;
        applyStyle('insertHTML', audioTag);
      }

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const generateCode = async () => {
    setIsGeneratingCode(true);
    try {
      const response = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content, language: codeLanguage }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data = await response.json();
      setCodeSnippet(data.code);
      setShowCodeEditor(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const reviewCode = async () => {
    setIsReviewingCode(true);
    try {
      const response = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeSnippet, language: codeLanguage }),
      });

      if (!response.ok) {
        throw new Error('Failed to review code');
      }

      const data = await response.json();
      toast({
        title: 'Code Review',
        description: data.review,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to review code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReviewingCode(false);
    }
  };

  const handleEmbed = (url: string) => {
    const embedHtml = `<div class="aspect-w-16 aspect-h-9"><iframe src="${url}" allowfullscreen></iframe></div>`;
    applyStyle('insertHTML', embedHtml);
  };

  const insertImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      const imgTag = `<img src="${imageUrl}" alt="User inserted image" />`;
      applyStyle('insertHTML', imgTag);
    }
  };

  const insertLink = () => {
    const linkUrl = prompt('Enter link URL:');
    if (linkUrl) {
      const linkText = prompt('Enter link text (optional):') || linkUrl;
      applyStyle('insertHTML', `<a href="${linkUrl}" target="_blank">${linkText}</a>`);
    }
  };

  useEffect(() => {
    if (showCodeEditor) {
      if (editorRef.current) {
        editorRef.current.blur();
      }
    }
  }, [showCodeEditor]);

  useEffect(() => {

    const fetchIntegrations = async () => {
      if (session && session.user) {
        if (session.user.githubAccessToken) {
          const github = getGitHubClient(session.user.githubAccessToken);
          try {
            const repos = await github.repos.listForAuthenticatedUser();
            setRepositories(repos.data);
          } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            toast({
              title: 'Error',
              description: 'Failed to fetch GitHub repositories. Please try again.',
              variant: 'destructive',
            });
          }
        }

        if (session.user.notionAccessToken) {
          const notion = getNotionClient(session.user.notionAccessToken);
          try {
            const { results } = await notion.search({
              filter: { property: 'object', value: 'page' },
            });

            const filteredPages = results.filter((page): page is PageObjectResponse => 'properties' in page && 'title' in page.properties);

            setNotionPages(filteredPages);
          } catch (error) {
            console.error('Error fetching Notion pages:', error);
            toast({
              title: 'Error',
              description: 'Failed to fetch Notion pages. Please try again.',
              variant: 'destructive',
            });
          }
        }
      }
    };
    fetchIntegrations();
  }, [session, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold"
      />
      <Toolbar
        applyStyle={applyStyle}
        toggleCodeEditor={toggleCodeEditor}
        insertImage={insertImage}
        insertLink={insertLink}
        onUploadComplete={(url, type) => {
          if (type.startsWith('image/')) {
            const imgTag = `<img src="${url}" alt="Uploaded Image" width="500" />`;
            if (editorRef.current) {
              editorRef.current.innerHTML += imgTag;
              setContent(editorRef.current.innerHTML);
            }
          } else if (type.startsWith('video/')) {
            const videoTag = `<video src="${url}" controls width="500"></video>`;
            if (editorRef.current) {
              editorRef.current.innerHTML += videoTag;
              setContent(editorRef.current.innerHTML);
            }
          } else if (type.startsWith('audio/')) {
            const audioTag = `<audio src="${url}" controls></audio>`;
            if (editorRef.current) {
              editorRef.current.innerHTML += audioTag;
              setContent(editorRef.current.innerHTML);
            }
          }
        }}
        onEmbed={handleEmbed}
      />
      <Editor content={content} setContent={setContent} />
      <CodeEditorSection
        showCodeEditor={showCodeEditor}
        codeSnippet={codeSnippet}
        codeLanguage={codeLanguage}
        onCodeChange={setCodeSnippet}
        onLanguageChange={setCodeLanguage}
      />
      <TagList tags={tags} setTags={setTags} />
      <IntegrationSelectors
        session={session}
        repositories={repositories}
        setRepositories={setRepositories}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        notionPages={notionPages}
        setNotionPages={setNotionPages}
        selectedNotionPage={selectedNotionPage}
        setSelectedNotionPage={setSelectedNotionPage}
      />
      <AIControls
        handleAIAction={handleAIAction}
        generateCode={generateCode}
        reviewCode={reviewCode}
        isGeneratingCode={isGeneratingCode}
        isReviewingCode={isReviewingCode}
      />
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSaveEntry} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Save
        </Button>
      </div>
      <input type="file" onChange={handleFileUpload} />
    </motion.div>
  );
}