import React from 'react';
import { Button } from '@/components/ui/button';

interface AIControlsProps {
  handleAIAction: (action: 'suggest' | 'summarize') => Promise<void>;
  generateCode: () => Promise<void>;
  reviewCode: () => Promise<void>;
  isGeneratingCode: boolean;
  isReviewingCode: boolean;
}

export default function AIControls({ handleAIAction, generateCode, reviewCode, isGeneratingCode, isReviewingCode }: AIControlsProps) {
  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => handleAIAction('suggest')}>Suggest</Button>
      <Button variant="outline" size="sm" onClick={() => handleAIAction('summarize')}>Summarize</Button>
      <Button variant="outline" size="sm" onClick={generateCode} disabled={isGeneratingCode}>{isGeneratingCode ? 'Generating...' : 'Generate Code'}</Button>
      <Button variant="outline" size="sm" onClick={reviewCode} disabled={isReviewingCode}>{isReviewingCode ? 'Reviewing...' : 'Review Code'}</Button>
    </div>
  );
}