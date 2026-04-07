'use client'

import { useState } from 'react'
import { Workout } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

interface AIAnalysisProps {
  workouts: Workout[]
}

export function AIAnalysis({ workouts }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (workouts.length === 0) {
      setError('Please log some workouts first')
      return
    }

    setIsLoading(true)
    setError('')
    setAnalysis('')

    try {
      const response = await fetch('/api/analyze-workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workouts,
          userMessage: question,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze workouts')
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        fullText += chunk
        setAnalysis(fullText)
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to get analysis'
      setError(errorMsg)
      setAnalysis('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">🤖 AI Workout Coach</h2>
      
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6 space-y-4">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">
            Ask me anything about your workouts
          </label>
          <Input
            type="text"
            placeholder="e.g., How can I improve my bench press? Should I do more volume?"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value)
              setError('')
            }}
            disabled={isLoading}
            className="border-border"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleAnalyze()
              }
            }}
          />
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg text-sm font-medium">
            ❌ {error}
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={isLoading || workouts.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 font-semibold py-2.5 transition duration-200"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="w-4 h-4" />
              Analyzing your workouts...
            </span>
          ) : (
            '✨ Get AI Analysis'
          )}
        </Button>
      </div>

      {analysis && (
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-6 space-y-3">
          <h3 className="font-bold text-lg text-foreground">💡 Coach&apos;s Advice:</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed font-medium">
              {analysis}
            </p>
          </div>
        </div>
      )}

      {!analysis && !isLoading && workouts.length > 0 && (
        <div className="bg-muted/40 border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-base">Ask a question above to get personalized coaching insights</p>
        </div>
      )}

      {workouts.length === 0 && (
        <div className="bg-muted/40 border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">📝 Log some workouts first to get AI insights!</p>
        </div>
      )}
    </div>
  )
}
