// RichTextEditorContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface RichTextEditorContextProps {
  onSave: (content: string) => void;
  onCancel: () => void;
}

const RichTextEditorContext = createContext<RichTextEditorContextProps | undefined>(undefined);

export const useRichTextEditorContext = () => {
  const context = useContext(RichTextEditorContext);
  if (!context) {
    throw new Error('useRichTextEditorContext must be used within a RichTextEditorProvider');
  }
  return context;
};

export const RichTextEditorProvider = ({ children, onSave, onCancel }: { children: ReactNode, onSave: (content: string) => void, onCancel: () => void }) => {
  return (
    <RichTextEditorContext.Provider value={{ onSave, onCancel }}>
      {children}
    </RichTextEditorContext.Provider>
  );
};