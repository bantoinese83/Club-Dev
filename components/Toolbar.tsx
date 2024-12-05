import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Code,
    ImageIcon,
    LinkIcon
} from 'lucide-react';
import { FileUpload } from './FileUpload';
import { Embed } from './Embed';

interface ToolbarProps {
    applyStyle: (style: string, arg?: string) => void;
    toggleCodeEditor: () => void;
    insertImage: () => void;
    insertLink: () => void;
    onUploadComplete: (fileUrl: string, fileType: string) => void;
    onEmbed: (url: string) => void;
}

export default function Toolbar({
    applyStyle,
    toggleCodeEditor,
    insertImage,
    insertLink,
    onUploadComplete,
    onEmbed
}: ToolbarProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-2">
            <Button variant="outline" size="icon" onClick={() => applyStyle('bold')}><Bold className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('italic')}><Italic className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('underline')}><Underline className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('insertUnorderedList')}><List className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('insertOrderedList')}><ListOrdered className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('justifyLeft')}><AlignLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('justifyCenter')}><AlignCenter className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('justifyRight')}><AlignRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('formatBlock', 'h1')}><Heading1 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('formatBlock', 'h2')}><Heading2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={toggleCodeEditor}><Code className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={insertImage}><ImageIcon className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={insertLink}><LinkIcon className="h-4 w-4" /></Button>
            <FileUpload onUploadComplete={onUploadComplete} />
            <Embed onEmbed={onEmbed} />
        </div>
    );
}