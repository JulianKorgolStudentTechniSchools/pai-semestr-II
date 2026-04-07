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
    <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
      <h2 className="text-xl font-bold">AI Workout Coach</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ask me anything about your workouts
        </label>
        <Input
          type="text"
          placeholder="e.g., How can I improve my bench press? Should I do more volume?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleAnalyze()
            }
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={isLoading || workouts.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner className="w-4 h-4" />
            Analyzing...
          </span>
        ) : (
          'Get AI Analysis'
        )}
      </Button>

      {analysis && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-indigo-900 mb-2">Coach&apos;s Advice:</h3>
          <p className="text-indigo-800 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </p>
        </div>
      )}

      {!analysis && !isLoading && workouts.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-600">
          <p>Ask a question to get personalized coaching insights</p>
        </div>
      )}
    </div>
  )
}
