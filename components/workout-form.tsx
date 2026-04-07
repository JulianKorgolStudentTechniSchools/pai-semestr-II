'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Workout, WorkoutInput } from '@/lib/types'

interface WorkoutFormProps {
  onSubmit: (workout: WorkoutInput) => void
  onCancel: () => void
}

export function WorkoutForm({ onSubmit, onCancel }: WorkoutFormProps) {
  const [exerciseName, setExerciseName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [sets, setSets] = useState([{ setNumber: 1, weight: 0, reps: 0 }])
  const [errors, setErrors] = useState<string[]>([])

  const addSet = () => {
    setSets([...sets, { setNumber: sets.length + 1, weight: 0, reps: 0 }])
  }

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index))
  }

  const updateSet = (index: number, field: string, value: number) => {
    const newSets = [...sets]
    newSets[index] = { ...newSets[index], [field]: value }
    setSets(newSets)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    if (!exerciseName.trim()) newErrors.push('Exercise name is required')
    if (sets.some(s => s.weight <= 0)) newErrors.push('All weights must be greater than 0')
    if (sets.some(s => s.reps <= 0)) newErrors.push('All reps must be greater than 0')

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      exerciseName,
      date,
      notes,
      sets,
    })

    // Reset form
    setExerciseName('')
    setDate(new Date().toISOString().split('T')[0])
    setNotes('')
    setSets([{ setNumber: 1, weight: 0, reps: 0 }])
    setErrors([])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-foreground">Add New Workout</h2>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-1">
          {errors.map((error, i) => (
            <p key={i} className="text-destructive text-sm font-medium">
              • {error}
            </p>
          ))}
        </div>
      )}

      <Field>
        <FieldLabel>Exercise Name</FieldLabel>
        <Input
          type="text"
          placeholder="e.g., Bench Press, Squats, Deadlift"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className="border-border"
          required
        />
      </Field>

      <Field>
        <FieldLabel>Date</FieldLabel>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-border"
          required
        />
      </Field>

      <Field>
        <FieldLabel>Notes (optional)</FieldLabel>
        <Input
          type="text"
          placeholder="How did it feel? Any observations?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border-border"
        />
      </Field>

      <div className="border-t border-border pt-5">
        <h3 className="font-semibold text-foreground mb-4">Sets</h3>
        <div className="space-y-3">
          {sets.map((set, idx) => (
            <div key={idx} className="flex items-end gap-3 p-3 bg-muted/30 rounded-lg">
              <Field className="flex-1">
                <FieldLabel className="text-xs">Reps (Set {set.setNumber})</FieldLabel>
                <Input
                  type="number"
                  placeholder="Reps"
                  value={set.reps || ''}
                  onChange={(e) => updateSet(idx, 'reps', parseInt(e.target.value) || 0)}
                  className="border-border"
                  min="1"
                  required
                />
              </Field>
              <Field className="flex-1">
                <FieldLabel className="text-xs">Weight (kg)</FieldLabel>
                <Input
                  type="number"
                  placeholder="kg"
                  value={set.weight || ''}
                  onChange={(e) => updateSet(idx, 'weight', parseFloat(e.target.value) || 0)}
                  className="border-border"
                  step="0.5"
                  min="0"
                  required
                />
              </Field>
              {sets.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeSet(idx)}
                  className="mb-0 bg-destructive/20 hover:bg-destructive/30 text-destructive"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          onClick={addSet}
          className="mt-4 bg-muted hover:bg-muted/80 text-muted-foreground w-full font-medium"
        >
          ➕ Add Set
        </Button>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5"
        >
          💾 Save Workout
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-medium"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
