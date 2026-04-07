'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface RestTimerProps {
  initialSeconds?: number
  onComplete?: () => void
}

export function RestTimer({ initialSeconds = 60, onComplete }: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      if (seconds === 0 && isRunning) {
        setIsRunning(false)
        onComplete?.()
        // Play notification sound
        playNotification()
      }
      return
    }

    const interval = setInterval(() => {
      setSeconds((s) => s - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, seconds, onComplete])

  const playNotification = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gain.gain.setValueAtTime(0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const reset = () => {
    setIsRunning(false)
    setSeconds(initialSeconds)
  }

  const minutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-8 text-center border border-primary/20">
      <h3 className="text-lg font-bold text-foreground mb-6">⏱️ Rest Timer</h3>
      <div className="text-6xl font-bold text-primary mb-8 font-mono tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
      </div>
      <div className="flex gap-3 justify-center">
        <Button
          onClick={toggleTimer}
          className={`flex-1 font-semibold py-2.5 transition duration-200 ${
            isRunning
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </Button>
        <Button
          onClick={reset}
          className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold py-2.5"
        >
          🔄 Reset
        </Button>
      </div>
    </div>
  )
}
