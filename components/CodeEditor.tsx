'use client'

import React, { useRef, useEffect } from 'react'
import MonacoEditor, { monaco } from 'react-monaco-editor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface CodeEditorProps {
  initialCode: string
  language: string
  onCodeChange: (code: string) => void
  onLanguageChange: (language: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  onCodeChange,
  onLanguageChange,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
    toast({
      title: 'Editor Loaded',
      description: 'The code editor has been loaded successfully.',
    })
  }, [language, toast])

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  const handleCopyCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      if (code) {
        navigator.clipboard.writeText(code)
        toast({
          title: 'Code copied',
          description: 'The code has been copied to your clipboard.',
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <MonacoEditor
          width="100%"
          height="400"
          language={language}
          theme="vs-dark"
          value={initialCode}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
          onChange={onCodeChange}
          editorDidMount={handleEditorDidMount}
        />
        <div className="mt-4">
          <Button onClick={handleCopyCode}>Copy Code</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CodeEditor