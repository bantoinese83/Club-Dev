import { Seo } from '@/components/Seo'
import { AIWritingAssistant } from '@/components/AIWritingAssistant'
import { AICodeReviewer } from '@/components/AICodeReviewer'
import { AIProgrammingChat } from '@/components/AIProgrammingChat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

export default function AIAssistancePage() {
  return (
    <>
      <Seo 
        title="AI Assistance"
        description="Get AI-powered help with writing, code review, and programming questions"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">AI Assistance</h1>
        <Tabs defaultValue="writing">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="writing">Writing Assistant</TabsTrigger>
            <TabsTrigger value="code-review">Code Reviewer</TabsTrigger>
            <TabsTrigger value="programming-chat">Programming Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="writing">
            <AIWritingAssistant />
          </TabsContent>
          <TabsContent value="code-review">
            <AICodeReviewer />
          </TabsContent>
          <TabsContent value="programming-chat">
            <AIProgrammingChat />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

