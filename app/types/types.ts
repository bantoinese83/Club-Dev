// types.ts
export type Entry = {
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
};