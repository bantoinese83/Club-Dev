import React from 'react';
import CodeEditor from './CodeEditor';
import CodeSnippet from './CodeSnippet';

interface CodeEditorSectionProps {
  showCodeEditor: boolean;
  codeSnippet: string;
  codeLanguage: string;
  onCodeChange: (newCode: string) => void;
  onLanguageChange: (newLanguage: string) => void;
}

const CodeEditorSection = ({ showCodeEditor, codeSnippet, codeLanguage, onCodeChange, onLanguageChange }: CodeEditorSectionProps) => {
  return (
    <>
      {showCodeEditor && (
        <CodeEditor
          initialCode={codeSnippet}
          language={codeLanguage}
          onCodeChange={onCodeChange}
          onLanguageChange={onLanguageChange}
        />
      )}
      {!showCodeEditor && codeSnippet && (
        <CodeSnippet code={codeSnippet} language={codeLanguage} />
      )}
    </>
  );
};

export default CodeEditorSection;