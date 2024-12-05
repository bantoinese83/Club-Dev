import { Handle, Position, NodeProps } from 'reactflow';
import React from "react";

interface CodeNodeData {
  code?: string;
}

export function CodeNode({ data }: NodeProps<CodeNodeData>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <div className="font-bold">Code Snippet</div>
      <pre className="text-gray-700 text-sm">{data.code || 'console.log("Hello, World!");'}</pre>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
}

