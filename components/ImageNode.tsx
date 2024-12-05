import { Handle, Position, NodeProps } from 'reactflow';
import React from "react";

interface ImageNodeData {
  src?: string;
  alt?: string;
  label?: string;
}

export function ImageNode({ data }: NodeProps<ImageNodeData>) {
  return (
    <div className="shadow-md rounded-md bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <img src={data.src || '/placeholder.svg'} alt={data.alt || 'Image'} className="w-32 h-32 object-cover" />
      <div className="px-2 py-1 text-center">{data.label || 'Image'}</div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
}

