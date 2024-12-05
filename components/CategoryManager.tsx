'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {useToast} from "@/hooks/use-toast";

type Category = {
  id: string
  name: string
  _count: { entries: number }
}

type CategoryManagerProps = {
  categories: Category[]
  onCategoryAdded: () => void
}

export function CategoryManager({ categories, onCategoryAdded }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('')
  const { toast } = useToast()

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      })
      if (!response.ok) throw new Error('Failed to add category')
      setNewCategory('')
      onCategoryAdded()
      toast({
        title: 'Success',
        description: 'Category added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive',
      })
    }
  }

  return (
    <div>
      <form onSubmit={handleAddCategory} className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-2">
        {categories.map(category => (
          <li key={category.id} className="flex justify-between items-center">
            <span>{category.name}</span>
            <span className="text-sm text-muted-foreground">({category._count.entries})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

