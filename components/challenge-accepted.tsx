"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ChallengeDimensionCard } from "@/components/challenge-dimension-card"
import type { Challenge } from "@/lib/challenge-data"

interface ChallengeAcceptedProps {
  isVisible: boolean
  challenge: Challenge
  onComplete: () => void
}

export function ChallengeAccepted({ isVisible, challenge, onComplete }: ChallengeAcceptedProps) {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const duration = 5000

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      const progressPercent = Math.min((elapsed / duration) * 100, 100)
      const secondsLeft = Math.max(Math.ceil((duration - elapsed) / 1000), 0)

      setProgress(progressPercent)
      setTimeLeft(secondsLeft)

      if (elapsed >= duration) {
        window.clearInterval(interval)
        onComplete()
        window.open("https://discord.com/invite/xfYPDZYqeh", "_blank")
      }
    }, 100)

    return () => window.clearInterval(interval)
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-0/80 p-4 backdrop-blur-xl">
      <div className="w-full max-w-5xl space-y-5">
        <section className="glass-card-featured rounded-lg p-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <CheckCircle2 className="size-7" />
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-gold">Challenge accepted</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-fg">Your 4D coordinates are saved</h2>
          <p className="mx-auto mt-3 max-w-2xl text-fg-muted">
            You are being sent to Discord with the accepted challenge stored in Firebase.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ChallengeDimensionCard
            dimension={1}
            label="Core Constraint"
            tagline="What you cannot use"
            value={challenge.constraint}
            accent="blue"
            compact
          />
          <ChallengeDimensionCard
            dimension={2}
            label="Line Budget"
            tagline="How much you can write"
            value={challenge.budget}
            accent="gold"
            compact
          />
          <ChallengeDimensionCard
            dimension={3}
            label="Project Domain"
            tagline="What you build"
            value={challenge.domain}
            accent="green"
            compact
          />
          <ChallengeDimensionCard
            dimension={4}
            label="Language"
            tagline="What you write it in"
            value={challenge.language}
            accent="red"
            compact
          />
        </div>

        <section className="glass-card rounded-lg p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
              Redirecting to Discord in {timeLeft}s
            </span>
            <span className="font-mono text-xs text-gold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/10" />
        </section>
      </div>
    </div>
  )
}
