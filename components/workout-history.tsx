'use client'

import { Workout } from '@/lib/types'
import { Button } from '@/components/ui/button'

interface WorkoutHistoryProps {
  workouts: Workout[]
  onDelete: (id: string) => void
}

export function WorkoutHistory({ workouts, onDelete }: WorkoutHistoryProps) {
  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500">No workouts logged yet. Start by adding your first workout!</p>
      </div>
    )
  }

  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Workout History</h2>
      <div className="space-y-3">
        {sortedWorkouts.map((workout) => (
          <div key={workout.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{workout.exerciseName}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(workout.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {workout.notes && (
                  <p className="text-sm text-gray-700 mt-2">{workout.notes}</p>
                )}
                <div className="mt-2 space-y-1">
                  {workout.sets.map((set) => (
                    <p key={set.id} className="text-sm text-gray-600">
                      Set {set.setNumber}: {set.reps} reps × {set.weight}kg
                    </p>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => onDelete(workout.id)}
                className="bg-red-100 hover:bg-red-200 text-red-700 text-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
