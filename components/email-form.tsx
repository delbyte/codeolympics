"use client"

import type React from "react"

import { useState } from "react"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { ArrowRight, Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import type { Challenge } from "@/lib/challenge-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChallengeDimensionCard } from "@/components/challenge-dimension-card"

interface EmailFormProps {
  onEmailSubmitted: (email: string, discordUsername: string) => void
}

export function EmailForm({ onEmailSubmitted }: EmailFormProps) {
  const [email, setEmail] = useState("")
  const [discordUsername, setDiscordUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [acceptedCombo, setAcceptedCombo] = useState<Partial<Challenge> | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setAcceptedCombo(null)

    try {
      if (!db) {
        setError("Firebase is not configured. Add the existing project keys to the environment.")
        setIsLoading(false)
        return
      }

      const participantsQuery = query(collection(db, "participants"), where("email", "==", email.trim()))
      const querySnapshot = await getDocs(participantsQuery)

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data()

        setAcceptedCombo(userData.acceptedCombo ?? null)
        setError("This email is already registered for the challenge.")
        setIsLoading(false)
        return
      }

      await addDoc(collection(db, "participants"), {
        email: email.trim(),
        discordUsername: discordUsername.trim(),
        timestamp: new Date(),
        playCount: 0,
        acceptedCombo: null,
        language: null,
        hasPlayed: false,
      })

      onEmailSubmitted(email.trim(), discordUsername.trim())
    } catch (err) {
      console.error("Error saving participant:", err)
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card-featured w-full max-w-md rounded-lg p-6">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Challenge generator</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Enter the arena</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Register once, spin up to three times, then lock in your 4D challenge.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-12 rounded-lg border-white/10 bg-white/[0.03] px-4 text-fg placeholder:text-fg-muted focus-visible:border-gold/60 focus-visible:ring-gold/20"
        />
        <Input
          type="text"
          placeholder="Discord username"
          value={discordUsername}
          onChange={(event) => setDiscordUsername(event.target.value)}
          required
          className="h-12 rounded-lg border-white/10 bg-white/[0.03] px-4 text-fg placeholder:text-fg-muted focus-visible:border-gold/60 focus-visible:ring-gold/20"
        />

        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-[#ffb4bf]">
            {error}
          </div>
        )}

        {acceptedCombo?.constraint && acceptedCombo.budget && acceptedCombo.domain && (
          <div className="space-y-3 pt-2">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-fg-muted">
              Previously accepted
            </p>
            <ChallengeDimensionCard
              compact
              dimension={1}
              label="Core Constraint"
              tagline="What you cannot use"
              value={acceptedCombo.constraint}
              accent="blue"
            />
            <ChallengeDimensionCard
              compact
              dimension={2}
              label="Line Budget"
              tagline="How much you can write"
              value={acceptedCombo.budget}
              accent="gold"
            />
            <ChallengeDimensionCard
              compact
              dimension={3}
              label="Project Domain"
              tagline="What you build"
              value={acceptedCombo.domain}
              accent="green"
            />
            {acceptedCombo.language && (
              <ChallengeDimensionCard
                compact
                dimension={4}
                label="Language"
                tagline="What you write it in"
                value={acceptedCombo.language}
                accent="red"
              />
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-full bg-gold font-bold text-surface-0 shadow-[0_0_24px_rgba(201,162,39,0.18)] transition-all hover:bg-gold-light"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing
            </>
          ) : (
            <>
              Generate My Challenge
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
