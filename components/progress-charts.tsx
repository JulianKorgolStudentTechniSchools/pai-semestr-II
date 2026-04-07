'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Workout } from '@/lib/types'

interface ProgressChartsProps {
  workouts: Workout[]
}

export function ProgressCharts({ workouts }: ProgressChartsProps) {
  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500">No data to display yet. Log your first workout!</p>
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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Progress Charts</h2>

      {exercises.map(({ name, data }) => (
        <div key={name} className="space-y-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">{name} - Weight Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgWeight"
                  stroke="#4f46e5"
                  name="Avg Weight (kg)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  stroke="#10b981"
                  name="Max Weight (kg)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">{name} - Total Reps</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalReps" fill="#f59e0b" name="Total Reps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}
