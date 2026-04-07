'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useWorkouts } from '@/lib/use-workouts'
import { WorkoutForm } from '@/components/workout-form'
import { WorkoutHistory } from '@/components/workout-history'
import { ProgressCharts } from '@/components/progress-charts'
import { RestTimer } from '@/components/rest-timer'
import { Button } from '@/components/ui/button'
import { WorkoutInput } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isLoading: authLoading, isAuthenticated } = useAuth()
  const { workouts, addWorkout, deleteWorkout, isLoading: workoutsLoading } = useWorkouts()
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'charts'>('overview')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || workoutsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your workouts...</p>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workout Logger</h1>
            <p className="text-muted-foreground text-sm">Welcome, <span className="font-semibold text-accent">{user?.name}</span>!</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
          {(['overview', 'history', 'charts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'history' && '📝 History'}
              {tab === 'charts' && '📈 Progress'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition">
                  <p className="text-muted-foreground text-sm font-medium">Total Workouts</p>
                  <p className="text-4xl font-bold text-primary mt-2">{workouts.length}</p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition">
                  <p className="text-muted-foreground text-sm font-medium">Total Sets</p>
                  <p className="text-4xl font-bold text-accent mt-2">
                    {workouts.reduce((sum, w) => sum + w.sets.length, 0)}
                  </p>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition">
                  <p className="text-muted-foreground text-sm font-medium">Total Reps</p>
                  <p className="text-4xl font-bold text-secondary mt-2">
                    {workouts.reduce((sum, w) => sum + w.sets.reduce((s, set) => s + set.reps, 0), 0)}
                  </p>
                </div>
              </div>

              {/* Add Workout Button */}
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl transition duration-200"
                >
                  ➕ Add New Workout
                </Button>
              )}

              {/* Workout Form */}
              {showForm && (
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <WorkoutForm
                    onSubmit={handleAddWorkout}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              )}
            </div>

            {/* Rest Timer Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-6 rounded-xl shadow-sm sticky top-32">
                <RestTimer initialSeconds={60} />
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <WorkoutHistory workouts={workouts} onDelete={deleteWorkout} />
          </div>
        )}

        {/* Progress Charts Tab */}
        {activeTab === 'charts' && (
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <ProgressCharts workouts={workouts} />
          </div>
        )}
      </main>
    </div>
  )
}
