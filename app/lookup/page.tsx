"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Loader2, Search } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ChallengeDimensionCard } from "@/components/challenge-dimension-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserData } from "@/lib/firebase"
import type { Challenge } from "@/lib/challenge-data"

export default function LookupPage() {
  const [email, setEmail] = useState("")
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage("")
    setChallenge(null)

    const data = await getUserData(email.trim())
    const acceptedCombo = data?.acceptedCombo as Challenge | null | undefined

    if (!data) {
      setMessage("No participant was found for that email.")
    } else if (!acceptedCombo) {
      setMessage("That email is registered, but no challenge has been accepted yet.")
    } else {
      setChallenge(acceptedCombo)
    }

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-surface-1 text-fg">
      <SiteHeader />

      <section className="container py-14">
        <Link href="/" className="glass-btn inline-flex rounded-full px-5 py-2 text-sm font-semibold text-fg hover:text-gold">
          <ArrowLeft className="mr-2 size-4" />
          Back to Generator
        </Link>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Accepted combination</p>
          <h1 className="hero-title mt-4 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Check Your 4D Challenge
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            Enter the same email you registered with to retrieve the challenge you accepted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-featured mx-auto mt-10 flex max-w-xl flex-col gap-4 rounded-lg p-5 sm:flex-row">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-12 flex-1 rounded-lg border-white/10 bg-white/[0.03] px-4 text-fg placeholder:text-fg-muted focus-visible:border-gold/60 focus-visible:ring-gold/20"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-full bg-gold px-7 font-bold text-surface-0 hover:bg-gold-light"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Check
          </Button>
        </form>

        {message && (
          <div className="glass-pill mx-auto mt-6 max-w-xl rounded-lg p-4 text-center text-sm text-fg-muted">
            {message}
          </div>
        )}

        {challenge && (
          <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ChallengeDimensionCard
              dimension={1}
              label="Core Constraint"
              tagline="What you cannot use"
              value={challenge.constraint}
              accent="blue"
            />
            <ChallengeDimensionCard
              dimension={2}
              label="Line Budget"
              tagline="How much you can write"
              value={challenge.budget}
              accent="gold"
            />
            <ChallengeDimensionCard
              dimension={3}
              label="Project Domain"
              tagline="What you build"
              value={challenge.domain}
              accent="green"
            />
            <ChallengeDimensionCard
              dimension={4}
              label="Language"
              tagline="What you write it in"
              value={challenge.language}
              accent="red"
            />
          </div>
        )}
      </section>
    </main>
  )
}
