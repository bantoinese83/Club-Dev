import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmbedProps {
  onEmbed: (url: string) => void;
}

export function Embed({ onEmbed }: EmbedProps) {
  const [url, setUrl] = useState('');

  const handleEmbed = () => {
    if (url) {
      onEmbed(url);
      setUrl('');
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        type="text"
        placeholder="Enter embed URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleEmbed}>Embed</Button>
    </div>
  );
}