import React, { useRef } from 'react';
import { useTheme } from 'next-themes';

interface EditorProps {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}


export default function Editor({ content, setContent }: EditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const { resolvedTheme } = useTheme();

    return (
        <div
            ref={editorRef}
            contentEditable
            className={`border border-input bg-background px-3 py-2 text-sm ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[200px] ${resolvedTheme === 'dark' ? 'dark' : ''}`}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content }}
            suppressContentEditableWarning
        />
    );
}