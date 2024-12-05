'use client'
import React from 'react';

import {useState, useCallback, useRef, useEffect} from 'react'
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge as EdgeType,
    Panel,
    useReactFlow,
    ReactFlowProvider,
    NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Loader2, Plus, Share2} from 'lucide-react'
import {CodeNode} from '@/components/CodeNode'
import {ImageNode} from '@/components/ImageNode'
import {LinkNode} from '@/components/LinkNode'
import {useSession} from 'next-auth/react'
import {SkeletonLoader} from '@/components/SkeletonLoader'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {ScrollArea} from '@/components/ui/scroll-area'
import {ShareModal} from '@/components/ShareModal'
import {useToast} from "@/hooks/use-toast";

const nodeTypes: NodeTypes = {
    codeNode: CodeNode,
    imageNode: ImageNode,
    linkNode: LinkNode,
}

interface MindMap {
    id: string
    name: string
    content: string
    isPublic: boolean
}

const initialNodes: Node[] = [
    {id: '1', type: 'input', position: {x: 0, y: 0}, data: {label: 'Main Topic'}},
]

const initialEdges: Edge[] = []

export function MindMapGenerator() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [topic, setTopic] = useState('')
    const [mindMapName, setMindMapName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [savedMindMaps, setSavedMindMaps] = useState<MindMap[]>([])
    const {toast} = useToast()
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const {project} = useReactFlow()
    const {data: session} = useSession()
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [currentMindMap, setCurrentMindMap] = useState<MindMap | null>(null)

    const onConnect = useCallback((params: Connection | EdgeType) => setEdges((eds) => addEdge(params, eds)), [setEdges])

    const generateMindMap = async () => {
        if (!session) {
            toast({
                title: 'Error',
                description: 'You must be logged in to generate a mind map.',
                variant: 'destructive',
            })
            return
        }

        if (!topic) {
            toast({
                title: 'Error',
                description: 'Please enter a topic for the mind map.',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/ai/generate-mindmap', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({topic}),
            })

            if (!response.ok) {
                throw new Error('Failed to generate mind map')
            }

            const data = await response.json()
            const {nodes: newNodes, edges: newEdges} = parseMindMapData(data.mindMap)

            setNodes(newNodes)
            setEdges(newEdges)

            toast({
                title: 'Success',
                description: 'Mind map generated successfully!',
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to generate mind map. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const parseMindMapData = (data: string) => {
        const lines = data.split('\n')
        const nodes: Node[] = []
        const edges: Edge[] = []
        let id = 1

        lines.forEach((line, index) => {
            const level = line.search(/\S/)
            const label = line.trim()

            nodes.push({
                id: id.toString(),
                type: 'default',
                data: {label},
                position: {x: level * 200, y: index * 100},
            })

            if (index > 0) {
                const parentId = nodes.findLast(n => n.position.x < level * 200)?.id
                if (parentId) {
                    edges.push({
                        id: `e${parentId}-${id}`,
                        source: parentId,
                        target: id.toString(),
                    })
                }
            }

            id++
        })

        return {nodes, edges}
    }

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault()

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
            const type = event.dataTransfer.getData('application/reactflow')

            if (typeof type === 'undefined' || !type || !reactFlowBounds) {
                return
            }

            const position = project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            })
            const newNode: Node = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: {label: `${type} node`},
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [project]
    )

    const onNodeDoubleClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            const updatedNodes = nodes.map((n) => {
                if (n.id === node.id) {
                    const newLabel = prompt('Enter new label:', n.data.label)
                    if (newLabel) {
                        return {...n, data: {...n.data, label: newLabel}}
                    }
                }
                return n
            })
            setNodes(updatedNodes)
        },
        [nodes, setNodes]
    )

    const saveMindMap = async () => {
        if (!session) {
            toast({
                title: 'Error',
                description: 'You must be logged in to save a mind map.',
                variant: 'destructive',
            })
            return
        }

        if (!mindMapName) {
            toast({
                title: 'Error',
                description: 'Please enter a name for the mind map.',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/mindmaps', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: mindMapName, nodes, edges}),
            })

            if (!response.ok) {
                throw new Error('Failed to save mind map')
            }

            toast({
                title: 'Success',
                description: 'Mind map saved successfully!',
            })
            fetchSavedMindMaps()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save mind map. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSavedMindMaps = async () => {
        try {
            const response = await fetch('/api/mindmaps')
            if (!response.ok) {
                throw new Error('Failed to load mind maps')
            }

            const mindMaps: MindMap[] = await response.json()
            setSavedMindMaps(mindMaps)
        } catch (error) {
            console.error('Error fetching saved mind maps:', error)
        }
    }

    const loadMindMap = async (id: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/mindmaps/${id}`)
            if (!response.ok) {
                throw new Error('Failed to load mind map')
            }

            const mindMap: MindMap = await response.json()
            const {nodes: loadedNodes, edges: loadedEdges} = JSON.parse(mindMap.content)

            setNodes(loadedNodes)
            setEdges(loadedEdges)
            setMindMapName(mindMap.name)

            toast({
                title: 'Success',
                description: 'Mind map loaded successfully!',
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load mind map. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    useEffect(() => {
        fetchSavedMindMaps()
    }, [])

    const handleShareClick = (mindMap: MindMap) => {
        setCurrentMindMap(mindMap)
        setIsShareModalOpen(true)
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-4">
                <div className="flex-1 space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter a topic for your mind map"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <Button onClick={generateMindMap} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Generate
                        </Button>
                    </div>
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Mind Map Name"
                            value={mindMapName}
                            onChange={(e) => setMindMapName(e.target.value)}
                        />
                        <Button onClick={saveMindMap} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Save
                        </Button>
                    </div>
                    <div className="h-[600px] w-full border rounded-md" ref={reactFlowWrapper}>
                        {isLoading ? (
                            <SkeletonLoader/>
                        ) : (
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                nodeTypes={nodeTypes}
                                onNodeDoubleClick={onNodeDoubleClick}
                            >
                                <Controls/>
                                <Background/>
                                <Panel position="top-right">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Add Nodes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col space-y-2">
                                                {['default', 'codeNode', 'imageNode', 'linkNode'].map((type) => (
                                                    <Button
                                                        key={type}
                                                        variant="outline"
                                                        className="justify-start"
                                                        onDragStart={(event) => onDragStart(event, type)}
                                                        draggable
                                                    >
                                                        <Plus className="mr-2 h-4 w-4"/>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </Button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Panel>
                            </ReactFlow>
                        )}
                    </div>
                </div>
                <Card className="w-64">
                    <CardHeader>
                        <CardTitle>Saved Mind Maps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-2">
                                {savedMindMaps.map((mindMap) => (
                                    <div key={mindMap.id} className="flex items-center space-x-2">
                                        <Button
                                            onClick={() => loadMindMap(mindMap.id)}
                                            variant="outline"
                                            className="flex-grow justify-start"
                                        >
                                            {mindMap.name}
                                        </Button>
                                        <Button
                                            onClick={() => handleShareClick(mindMap)}
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Share2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            {currentMindMap && (
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    mindMapId={currentMindMap.id}
                    isPublic={currentMindMap.isPublic}
                />
            )}
        </div>
    )
}

export function MindMapGeneratorWrapper() {
    return (
        <ReactFlowProvider>
            <MindMapGenerator/>
        </ReactFlowProvider>
    )
}