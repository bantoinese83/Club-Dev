'use client'

import React, {useEffect, useRef} from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-csharp'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {toast} from "@/hooks/use-toast";

interface CodeSnippetProps {
    code: string
    language: string
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({code, language}) => {
    const codeRef = useRef<HTMLPreElement>(null)

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current)
        }
    }, [code, language])

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code)
            .then(() => {
                toast({
                    title: 'Code copied',
                    description: 'The code has been copied to your clipboard.',
                })
            })
            .catch((error) => {
                toast({
                    title: 'Error',
                    description: `Failed to copy code: ${error.message}`,
                    variant: 'destructive',
                })
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Code Snippet</CardTitle>
            </CardHeader>
            <CardContent>
        <pre>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
                <div className="mt-4">
                    <Button onClick={handleCopyCode}>Copy Code</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default CodeSnippet

