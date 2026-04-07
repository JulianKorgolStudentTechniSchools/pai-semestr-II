'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useWorkouts } from '@/lib/use-workouts'
import { WorkoutForm } from '@/components/workout-form'
import { WorkoutHistory } from '@/components/workout-history'
import { ProgressCharts } from '@/components/progress-charts'
import { RestTimer } from '@/components/rest-timer'
import { AIAnalysis } from '@/components/ai-analysis'
import { Button } from '@/components/ui/button'
import { WorkoutInput } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isLoading: authLoading, isAuthenticated } = useAuth()
  const { workouts, addWorkout, deleteWorkout, isLoading: workoutsLoading } = useWorkouts()
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'charts' | 'coach'>('overview')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || workoutsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleAddWorkout = (input: WorkoutInput) => {
    addWorkout(input)
    setShowForm(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workout Logger</h1>
            <p className="text-gray-600">Welcome, {user?.name}!</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['overview', 'history', 'charts', 'coach'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'history' && 'History'}
              {tab === 'charts' && 'Progress'}
              {tab === 'coach' && 'AI Coach'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm">Total Workouts</p>
                  <p className="text-3xl font-bold text-indigo-600">{workouts.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm">Total Sets</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {workouts.reduce((sum, w) => sum + w.sets.length, 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm">Total Reps</p>
                  <p className="text-3xl font-bold text-green-600">
                    {workouts.reduce((sum, w) => sum + w.sets.reduce((s, set) => s + set.reps, 0), 0)}
                  </p>
                </div>
              </div>

              {/* Add Workout Button */}
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg"
                >
                  + Add New Workout
                </Button>
              )}

              {/* Workout Form */}
              {showForm && (
                <WorkoutForm
                  onSubmit={handleAddWorkout}
                  onCancel={() => setShowForm(false)}
                />
              )}
            </div>

            {/* Rest Timer Sidebar */}
            <div className="lg:col-span-1">
              <RestTimer initialSeconds={60} />
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <WorkoutHistory workouts={workouts} onDelete={deleteWorkout} />
        )}

        {/* Progress Charts Tab */}
        {activeTab === 'charts' && (
          <ProgressCharts workouts={workouts} />
        )}

        {/* AI Coach Tab */}
        {activeTab === 'coach' && (
          <AIAnalysis workouts={workouts} />
        )}
      </main>
    </div>
  )
}
