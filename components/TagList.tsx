import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge'; // Assuming Badge is a custom component

interface TagListProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagList({ tags, setTags }: TagListProps) {
  const handleAddTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTag = (e.currentTarget.elements.namedItem('newTag') as HTMLInputElement)?.value;
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      (e.currentTarget.elements.namedItem('newTag') as HTMLInputElement).value = '';
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} className="flex items-center space-x-1">
            <span>{tag}</span>
            <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
          </Badge>
        ))}
      </div>
      <form onSubmit={handleAddTag} className="flex space-x-2">
        <Input className="flex-1" name="newTag" placeholder="Add tags (comma-separated)" type="text" />
        <Button type="submit">Add Tags</Button>
      </form>
    </>
  );
}