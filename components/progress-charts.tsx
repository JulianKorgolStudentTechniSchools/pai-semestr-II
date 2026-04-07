'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Workout } from '@/lib/types'

interface ProgressChartsProps {
  workouts: Workout[]
}

export function ProgressCharts({ workouts }: ProgressChartsProps) {
  if (workouts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl p-12 text-center border border-border">
        <p className="text-muted-foreground text-lg">📊 No data to display yet. Log your first workout!</p>
      </div>
    )
  }

  // Group by exercise and calculate averages
  const exerciseData: Record<string, any[]> = {}

  workouts.forEach((workout) => {
    if (!exerciseData[workout.exerciseName]) {
      exerciseData[workout.exerciseName] = []
    }

    const avgWeight =
      workout.sets.reduce((sum, set) => sum + set.weight, 0) / Math.max(workout.sets.length, 1)
    const totalReps = workout.sets.reduce((sum, set) => sum + set.reps, 0)
    const maxWeight = Math.max(...workout.sets.map((s) => s.weight))

    exerciseData[workout.exerciseName].push({
      date: new Date(workout.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      avgWeight: parseFloat(avgWeight.toFixed(1)),
      maxWeight: parseFloat(maxWeight.toFixed(1)),
      totalReps,
      timestamp: new Date(workout.date).getTime(),
    })
  })

  // Sort by timestamp and take last 10
  const exercises = Object.entries(exerciseData).map(([name, data]) => ({
    name,
    data: data.sort((a, b) => a.timestamp - b.timestamp).slice(-10),
  }))

  // Get theme colors
  const primaryColor = 'rgb(85, 102, 204)' // primary
  const accentColor = 'rgb(204, 170, 66)' // accent/secondary
  const chartColor1 = 'rgb(85, 102, 204)' // chart-1
  const chartColor2 = 'rgb(204, 170, 66)' // chart-2

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Progress Charts</h2>

      {exercises.map(({ name, data }) => (
        <div key={name} className="space-y-4">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-6">📈 {name} - Weight Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgWeight"
                  stroke={chartColor1}
                  name="Avg Weight (kg)"
                  strokeWidth={2}
                  dot={{ fill: chartColor1 }}
                />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  stroke={chartColor2}
                  name="Max Weight (kg)"
                  strokeWidth={2}
                  dot={{ fill: chartColor2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-6">📊 {name} - Total Reps</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="totalReps" fill={accentColor} name="Total Reps" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}
