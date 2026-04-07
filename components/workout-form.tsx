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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold">Add New Workout</h2>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((error, i) => (
            <p key={i} className="text-red-700 text-sm">
              • {error}
            </p>
          ))}
        </div>
      )}

      <Field>
        <FieldLabel>Exercise Name</FieldLabel>
        <Input
          type="text"
          placeholder="e.g., Bench Press"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel>Date</FieldLabel>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel>Notes (optional)</FieldLabel>
        <Input
          type="text"
          placeholder="Any notes about this workout..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4">Sets</h3>
        <div className="space-y-3">
          {sets.map((set, idx) => (
            <div key={idx} className="flex items-end gap-3">
              <Field className="flex-1">
                <FieldLabel>Set {set.setNumber}</FieldLabel>
                <Input
                  type="number"
                  placeholder="Reps"
                  value={set.reps || ''}
                  onChange={(e) => updateSet(idx, 'reps', parseInt(e.target.value) || 0)}
                  min="1"
                  required
                />
              </Field>
              <Field className="flex-1">
                <FieldLabel>Weight (kg)</FieldLabel>
                <Input
                  type="number"
                  placeholder="Weight"
                  value={set.weight || ''}
                  onChange={(e) => updateSet(idx, 'weight', parseFloat(e.target.value) || 0)}
                  step="0.5"
                  min="0"
                  required
                />
              </Field>
              {sets.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeSet(idx)}
                  className="mb-0 bg-red-100 hover:bg-red-200 text-red-700"
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
          className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 w-full"
        >
          Add Set
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Save Workout
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
