"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChallengeVisualizer } from "@/components/challenge-visualizer"
import { SiteHeader } from "@/components/site-header"

export default function ChallengePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [discordUsername, setDiscordUsername] = useState<string | null>(null)

  useEffect(() => {
    const email = searchParams.get("email")
    const username = searchParams.get("username")

    if (!email) {
      router.push("/")
      return
    }

    setUserEmail(email)
    setDiscordUsername(username)
  }, [searchParams, router])

  if (!userEmail) {
    return (
      <main className="min-h-screen bg-surface-1 text-fg">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="glass-pill rounded-full px-5 py-2 font-mono text-sm text-fg-muted">Loading generator</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-1 text-fg">
      <SiteHeader />
      <ChallengeVisualizer userEmail={userEmail} discordUsername={discordUsername} />
    </main>
  )
}
