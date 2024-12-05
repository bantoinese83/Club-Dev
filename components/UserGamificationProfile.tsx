import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import React from 'react';
import { DefaultSession } from 'next-auth';

interface Achievement {
  id: string;
  name: string;
  description: string;
}

interface UserGamificationData {
  points: number;
  level: number;
  experiencePoints: number;
  achievements: Achievement[];
}

interface CustomSession extends DefaultSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserGamificationProfile() {
  const { data: session } = useSession() as { data: CustomSession | null };
  const [userData, setUserData] = useState<UserGamificationData | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserGamificationData();
    }
  }, [session]);

  const fetchUserGamificationData = async () => {
    try {
      const response = await fetch('/api/gamification/user-data');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    }
  };

  if (!userData) {
    return null;
  }

  const { points, level, experiencePoints, achievements } = userData;
  const xpForNextLevel = level * 100;
  const progress = (experiencePoints / xpForNextLevel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">Points: {points}</p>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Level {level}</p>
          <Progress value={progress} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-1">
            {experiencePoints} / {xpForNextLevel} XP
          </p>
        </div>
        <h3 className="text-lg font-semibold mb-2">Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement) => (
            <Badge key={achievement.id} variant="secondary">
              {achievement.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}