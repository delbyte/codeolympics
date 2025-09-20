"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChallengeVisualizer } from "@/components/challenge-visualizer"
import { DEV_BYPASS } from "@/lib/firebase"

export default function ChallengePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [discordUsername, setDiscordUsername] = useState<string | null>(null)

  useEffect(() => {
    const email = searchParams.get('email')
    const username = searchParams.get('username')

    if (!email && !DEV_BYPASS) {
      // Redirect to home if no email provided and not in dev bypass mode
      router.push('/')
      return
    }

    setUserEmail(email)
    setDiscordUsername(username)
  }, [searchParams, router])

  if (!userEmail && !DEV_BYPASS) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {DEV_BYPASS && <div className="fixed top-4 right-4 z-50 dev-bypass-indicator">DEV_BYPASS MODE ACTIVE</div>}

      <div className="container mx-auto px-4 py-16">
        <ChallengeVisualizer userEmail={userEmail || ''} discordUsername={discordUsername} />
      </div>
    </main>
  )
}