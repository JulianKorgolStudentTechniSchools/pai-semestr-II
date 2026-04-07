export interface Workout {
  id: string
  userId: string
  exerciseName: string
  date: string
  notes?: string
  sets: WorkoutSet[]
  createdAt: string
  updatedAt: string
}

export interface WorkoutSet {
  id: string
  workoutId: string
  setNumber: number
  weight: number
  reps: number
  createdAt: string
}

export interface WorkoutInput {
  exerciseName: string
  date: string
  notes?: string
  sets: WorkoutSetInput[]
}

export interface WorkoutSetInput {
  setNumber: number
  weight: number
  reps: number
}
