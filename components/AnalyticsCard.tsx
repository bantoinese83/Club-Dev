import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PieChart, Pie, LineChart, Line, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import React from "react";

interface AnalyticsCardProps {
  title: string
  value?: string
  type?: 'pie-chart' | 'line-chart'
  data?: { name: string; value: number }[]
  icon?: React.ReactNode
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function AnalyticsCard({ title, value, type, data, icon }: AnalyticsCardProps) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value && <p className="text-2xl font-bold">{value}</p>}
        {type === 'pie-chart' && data && (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                dataKey="value"
                data={data}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
        {type === 'line-chart' && data && (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

