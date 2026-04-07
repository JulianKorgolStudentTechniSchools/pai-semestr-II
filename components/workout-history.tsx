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
      <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl p-12 text-center border border-border">
        <p className="text-muted-foreground text-lg">📝 No workouts logged yet. Start by adding your first workout!</p>
      </div>
    )
  }

  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Workout History</h2>
      <div className="space-y-3">
        {sortedWorkouts.map((workout) => (
          <div key={workout.id} className="bg-card p-5 rounded-xl border border-border hover:shadow-md transition duration-200">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">{workout.exerciseName}</h3>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  📅 {new Date(workout.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {workout.notes && (
                  <p className="text-sm text-foreground/70 mt-3 italic">"{workout.notes}"</p>
                )}
                <div className="mt-4 space-y-2 bg-muted/30 p-3 rounded-lg">
                  {workout.sets.map((set) => (
                    <p key={set.id} className="text-sm font-medium text-foreground">
                      💪 Set {set.setNumber}: <span className="text-accent">{set.reps} reps</span> × <span className="text-primary">{set.weight}kg</span>
                    </p>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => onDelete(workout.id)}
                className="bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium flex-shrink-0"
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
