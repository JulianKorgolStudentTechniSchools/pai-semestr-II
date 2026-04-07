'use client'

import { useEffect, useState, useCallback } from 'react'
import { Workout, WorkoutInput } from './types'
import { useAuth } from './auth-context'

export function useWorkouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load workouts from localStorage
  useEffect(() => {
    if (!user) {
      setWorkouts([])
      setIsLoading(false)
      return
    }

    try {
      const key = `workouts_${user.id}`
      const stored = localStorage.getItem(key)
      const allWorkouts = stored ? JSON.parse(stored) : []
      setWorkouts(allWorkouts)
      setError(null)
    } catch (err) {
      setError('Failed to load workouts')
      setWorkouts([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const addWorkout = useCallback(
    (input: WorkoutInput) => {
      if (!user) {
        setError('User not authenticated')
        return null
      }

      try {
        const newWorkout: Workout = {
          id: `workout_${Date.now()}_${Math.random()}`,
          userId: user.id,
          exerciseName: input.exerciseName,
          date: input.date,
          notes: input.notes,
          sets: input.sets.map((s, idx) => ({
            id: `set_${Date.now()}_${idx}`,
            workoutId: `workout_${Date.now()}_${Math.random()}`, // Will be set after
            setNumber: s.setNumber,
            weight: s.weight,
            reps: s.reps,
            createdAt: new Date().toISOString(),
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Fix workout IDs for sets
        newWorkout.sets = newWorkout.sets.map(s => ({
          ...s,
          workoutId: newWorkout.id,
        }))

        const updated = [...workouts, newWorkout]
        const key = `workouts_${user.id}`
        localStorage.setItem(key, JSON.stringify(updated))
        setWorkouts(updated)
        setError(null)
        return newWorkout
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add workout'
        setError(message)
        return null
      }
    },
    [user, workouts]
  )

  const deleteWorkout = useCallback(
    (workoutId: string) => {
      if (!user) {
        setError('User not authenticated')
        return
      }

      try {
        const updated = workouts.filter(w => w.id !== workoutId)
        const key = `workouts_${user.id}`
        localStorage.setItem(key, JSON.stringify(updated))
        setWorkouts(updated)
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete workout'
        setError(message)
      }
    },
    [user, workouts]
  )

  return {
    workouts,
    isLoading,
    error,
    addWorkout,
    deleteWorkout,
  }
}
