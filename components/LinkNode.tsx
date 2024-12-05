import { Handle, Position, NodeProps } from 'reactflow';
import React from "react";

interface LinkNodeData {
  url?: string;
  label?: string;
}

export function LinkNode({ data }: NodeProps<LinkNodeData>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <a href={data.url || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        {data.label || 'Link'}
      </a>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
}

