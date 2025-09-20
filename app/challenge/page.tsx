"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChallengeVisualizer } from "@/components/challenge-visualizer"
import Image from "next/image"

export default function ChallengePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [discordUsername, setDiscordUsername] = useState<string | null>(null)

  useEffect(() => {
    const email = searchParams.get('email')
    const username = searchParams.get('username')

    if (!email) {
      // Redirect to home if no email provided
      router.push('/')
      return
    }

    setUserEmail(email)
    setDiscordUsername(username)
  }, [searchParams, router])

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white relative">
      <div className="absolute top-16 -left-64 z-10">
        <Image
          src="/images/ribbons.png"
          alt="Decorative ribbon"
          width={600}
          height={360}
          className=""
        />
      </div>
      <div className="absolute top-120 -right-48 z-10">
        <Image
          src="/images/ribbons.png"
          alt="Decorative ribbon"
          width={600}
          height={360}
          className="transform scale-x-[-1]"
        />
      </div>

      <div className="container mx-auto px-4 py-16">
        <ChallengeVisualizer userEmail={userEmail} discordUsername={discordUsername} />
      </div>
    </main>
  )
}