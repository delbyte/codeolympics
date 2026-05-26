"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { TesseractAnimation } from "./tesseract-animation"
import { ChallengeResults } from "./challenge-results"
import { generateRandomChallenge, type Challenge } from "@/lib/challenge-data"
import { Button } from "@/components/ui/button"
import { incrementPlayCount, getUserData } from "@/lib/firebase"

interface ChallengeVisualizerProps {
  userEmail: string
  discordUsername: string | null
}

export function ChallengeVisualizer({ userEmail, discordUsername }: ChallengeVisualizerProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [playCount, setPlayCount] = useState(0)
  const displayName = discordUsername || userEmail

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getUserData(userEmail)
      setPlayCount(data?.playCount || 0)
    }

    loadUserData()
  }, [userEmail])

  const handleGenerateChallenge = async () => {
    await incrementPlayCount(userEmail)
    setPlayCount((previous) => previous + 1)
    setIsAnimating(true)
    setChallenge(null)

    window.setTimeout(() => {
      setChallenge(generateRandomChallenge())
      setIsAnimating(false)
    }, 3000)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">4D challenge system</p>
          <h1 className="hero-title mt-4 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            Welcome, {displayName}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            The tesseract selects a core constraint, line budget, project domain, and assigned language.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {["Core", "Budget", "Domain", "Language"].map((label, index) => (
              <span key={label} className="glass-pill rounded-full px-4 py-2 font-mono text-xs text-fg-muted">
                D{index + 1} / {label}
              </span>
            ))}
          </div>
        </div>

        <TesseractAnimation isAnimating={isAnimating} playCount={playCount} />
      </div>

      {!challenge && !isAnimating && (
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateChallenge}
            className="h-12 rounded-full bg-gold px-8 font-bold text-surface-0 shadow-[0_0_26px_rgba(201,162,39,0.2)] transition-all hover:bg-gold-light"
          >
            <Sparkles className="size-4" />
            Spin The Tesseract
          </Button>
        </div>
      )}

      {challenge && !isAnimating && (
        <ChallengeResults
          challenge={challenge}
          onNewChallenge={handleGenerateChallenge}
          playCount={playCount}
          userEmail={userEmail}
        />
      )}
    </div>
  )
}
