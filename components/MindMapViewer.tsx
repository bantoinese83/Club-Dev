'use client'
import React, { useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { CodeNode } from '@/components/CodeNode'
import { ImageNode } from '@/components/ImageNode'
import { LinkNode } from '@/components/LinkNode'

const nodeTypes = {
  codeNode: CodeNode,
  imageNode: ImageNode,
  linkNode: LinkNode,
}

interface MindMapViewerProps {
  content: string
}

export function MindMapViewer({ content }: MindMapViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([])

  useEffect(() => {
    const { nodes: contentNodes, edges: contentEdges } = JSON.parse(content)
    setNodes(contentNodes)
    setEdges(contentEdges)
  }, [content, setNodes, setEdges])

  return (
    <div className="h-[600px] w-full border rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}