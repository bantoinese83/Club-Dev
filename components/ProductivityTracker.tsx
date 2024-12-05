'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

export function ProductivityTracker() {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [duration, setDuration] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/productivity');
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch activities',
        variant: 'destructive',
      });
    }
  };

  const addActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/productivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity: newActivity, duration: parseInt(duration) }),
      });
      if (!response.ok) throw new Error('Failed to add activity');
      setNewActivity('');
      setDuration('');
      fetchActivities();
      toast({
        title: 'Success',
        description: 'Activity added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add activity',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addActivity} className="flex space-x-2 mb-4">
          <Input
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="Activity name"
          />
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (minutes)"
          />
          <Button type="submit">Add</Button>
        </form>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="activity" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="duration" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}