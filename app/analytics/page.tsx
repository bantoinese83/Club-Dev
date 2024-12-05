'use client'
import React from 'react';
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { useSession } from 'next-auth/react'
import {useToast} from "@/hooks/use-toast";

interface AnalyticsData {
  totalUsers: number
  totalEntries: number
  totalLikes: number
  totalComments: number
  totalFollows: number
  topEntries: Array<{
    id: string
    title: string
    user: { name: string }
    _count: { likes: number; comments: number }
  }>
  mostActiveUsers: Array<{
    id: string
    name: string
    _count: { entries: number; followers: number; following: number }
  }>
  userGrowth: Array<{
    date: string
    count: number
  }>
  entryDistribution: Array<{
    category: string
    count: number
  }>
  engagementRate: number
  personalStats: {
    totalEntries: number
    totalLikesReceived: number
    totalCommentsReceived: number
    averageEntryLength: number
    tagsUsed: { tag: string; count: number }[]
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: 'Error',
        description: 'Failed to load analytics. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (!analyticsData) {
    return <div>Loading...</div>
  }

  const {
    totalUsers,
    totalEntries,
    totalLikes,
    totalComments,
    totalFollows,
    topEntries,
    mostActiveUsers,
    userGrowth,
    entryDistribution,
    engagementRate,
    personalStats,
  } = analyticsData

  const overviewData = [
    { name: 'Users', value: totalUsers },
    { name: 'Entries', value: totalEntries },
    { name: 'Likes', value: totalLikes },
    { name: 'Comments', value: totalComments },
    { name: 'Follows', value: totalFollows },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {overviewData.map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{(engagementRate * 100).toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Entries Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topEntries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="_count.likes" name="Likes" fill="#8884d8" />
                <Bar dataKey="_count.comments" name="Comments" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Active Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mostActiveUsers}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  name="Entries"
                  dataKey="_count.entries"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={userGrowth}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Entry Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Entry Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={entryDistribution}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {entryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Insights Section */}
      {session && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Personalized Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total Entries: {personalStats.totalEntries}</p>
                <p>Total Likes Received: {personalStats.totalLikesReceived}</p>
                <p>Total Comments Received: {personalStats.totalCommentsReceived}</p>
                <p>Average Entry Length: {personalStats.averageEntryLength}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Top Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {personalStats.tagsUsed.map(({ tag, count }) => (
                    <li key={tag}>{tag}: {count}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {/* Add more personalized insights cards here */}
          </div>
        </div>
      )}
    </div>
  )
}

