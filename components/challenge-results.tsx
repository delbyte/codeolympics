"use client"

import { useState } from "react"
import { CheckCircle2, Clipboard, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChallengeDimensionCard } from "@/components/challenge-dimension-card"
import { parseChallengePart, type Challenge } from "@/lib/challenge-data"
import { saveAcceptedCombo } from "@/lib/firebase"
import { ChallengeAccepted } from "@/components/challenge-accepted"

interface ChallengeResultsProps {
  challenge: Challenge
  onNewChallenge: () => void
  playCount: number
  userEmail: string
}

export function ChallengeResults({ challenge, onNewChallenge, playCount, userEmail }: ChallengeResultsProps) {
  const [showAcceptedModal, setShowAcceptedModal] = useState(false)
  const [copyLabel, setCopyLabel] = useState("Copy Details")
  const constraint = parseChallengePart(challenge.constraint)
  const budget = parseChallengePart(challenge.budget)
  const domain = parseChallengePart(challenge.domain)
  const language = parseChallengePart(challenge.language)
  const isLastAttempt = playCount >= 3

  const handleAcceptCombo = async () => {
    await saveAcceptedCombo(userEmail, challenge)
    setShowAcceptedModal(true)
  }

  const handleCopy = async () => {
    const challengeText = [
      "Code Olympics 2026 Challenge",
      "",
      `Core Constraint: ${challenge.constraint}`,
      `Line Budget: ${challenge.budget}`,
      `Project Domain: ${challenge.domain}`,
      `Language: ${challenge.language}`,
    ].join("\n")

    await navigator.clipboard.writeText(challengeText)
    setCopyLabel("Copied")
    window.setTimeout(() => setCopyLabel("Copy Details"), 1600)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Coordinates locked</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-fg sm:text-4xl">
          Your 4D Code Olympics Challenge
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-fg-muted">
          Build this exact combination for the hackathon. The language is part of the constraint.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <section className="glass-card-featured rounded-lg p-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Challenge summary</p>
        <p className="mt-4 text-lg leading-relaxed text-fg">
          Create a <span className="font-semibold text-[#8ff0b8]">{domain.title.toLowerCase()}</span> in{" "}
          <span className="font-semibold text-[#ff97a6]">{language.title}</span> with the{" "}
          <span className="font-semibold text-gold-light">{budget.title.toLowerCase()}</span> limit while following the{" "}
          <span className="font-semibold text-[#8ccfff]">{constraint.title.toLowerCase()}</span> constraint.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {!isLastAttempt && (
            <Button
              onClick={onNewChallenge}
              variant="outline"
              className="h-11 flex-1 rounded-full border-white/10 bg-white/[0.03] text-fg hover:bg-white/[0.07] hover:text-fg"
            >
              <RotateCcw className="size-4" />
              Try Again ({3 - playCount} left)
            </Button>
          )}

          <Button
            onClick={handleAcceptCombo}
            className="h-11 flex-1 rounded-full bg-gold font-bold text-surface-0 hover:bg-gold-light"
          >
            <CheckCircle2 className="size-4" />
            {isLastAttempt ? "Accept Final Challenge" : "Accept Challenge"}
          </Button>

          <Button
            onClick={handleCopy}
            variant="outline"
            className="h-11 flex-1 rounded-full border-white/10 bg-white/[0.03] text-fg hover:bg-white/[0.07] hover:text-fg"
          >
            <Clipboard className="size-4" />
            {copyLabel}
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-danger/30 bg-danger/10 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#ff97a6]">Important next step</p>
        <p className="mt-3 text-lg font-semibold text-fg">
          Attach this full 4D combination when submitting your project.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-fg-muted sm:grid-cols-2">
          <p>Save the constraint, budget, domain, and language together.</p>
          <p>Join Discord for competition updates, support, and submission reminders.</p>
        </div>
      </section>

      <ChallengeAccepted
        isVisible={showAcceptedModal}
        challenge={challenge}
        onComplete={() => setShowAcceptedModal(false)}
      />
    </div>
  )
}
