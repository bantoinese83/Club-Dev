'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  description: string;
  progress: number;
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data: Goal[] = await response.json();
      setGoals(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch goals',
        variant: 'destructive',
      });
    }
  };

  const addGoal = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newGoal }),
      });
      if (!response.ok) throw new Error('Failed to add goal');
      setNewGoal('');
      fetchGoals();
      toast({
        title: 'Success',
        description: 'Goal added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add goal',
        variant: 'destructive',
      });
    }
  };

  const updateGoalProgress = async (goalId: string, progress: number) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });
      if (!response.ok) throw new Error('Failed to update goal progress');
      fetchGoals();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update goal progress',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addGoal} className="flex space-x-2 mb-4">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a new goal"
          />
          <Button type="submit">Add Goal</Button>
        </form>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id}>
              <div className="flex justify-between items-center mb-2">
                <span>{goal.description}</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="w-full" />
              <div className="flex justify-between mt-2">
                <Button onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))} size="sm">-10%</Button>
                <Button onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))} size="sm">+10%</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}