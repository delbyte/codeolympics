"use client"

import { useState, useEffect } from "react"
import { CubeAnimation } from "./cube-animation"
import { ChallengeResults } from "./challenge-results"
import { generateRandomChallenge } from "@/lib/challenge-data"
import { Button } from "@/components/ui/button"
import { incrementPlayCount, getUserData } from "@/lib/firebase"

interface ChallengeVisualizerProps {
  userEmail: string
  discordUsername: string | null
}

export function ChallengeVisualizer({ userEmail, discordUsername }: ChallengeVisualizerProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [challenge, setChallenge] = useState<{
    constraint: string
    budget: string
    domain: string
  } | null>(null)
  const [playCount, setPlayCount] = useState(0)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Load user data when component mounts
    const loadUserData = async () => {
      const data = await getUserData(userEmail)
      setUserData(data)
      setPlayCount(data?.playCount || 0)
    }
    loadUserData()
  }, [userEmail])

  const handleGenerateChallenge = async () => {
    // Increment play count in database
    await incrementPlayCount(userEmail)
    setPlayCount(prev => prev + 1)
    
    setIsAnimating(true)
    setChallenge(null)

    // Simulate animation duration
    setTimeout(() => {
      const newChallenge = generateRandomChallenge()
      setChallenge(newChallenge)
      setIsAnimating(false)
    }, 3000) // 3 second animation
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-12 py-12 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-black font-nohemi drop-shadow-2xl">
          Welcome to Code Olympics!
        </h1>
        <p className="text-xl text-gray-600 font-nohemi drop-shadow-lg max-w-2xl leading-relaxed">
          Ready to discover your unique challenge, <span className="font-bold text-red-600 drop-shadow-md">{discordUsername || userEmail}</span>?
        </p>
      </div>

      <div className="w-full max-w-4xl relative">
        <CubeAnimation isAnimating={isAnimating} />
      </div>

      {!challenge && !isAnimating && (
        <Button
          onClick={handleGenerateChallenge}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-16 py-5 text-xl font-bold font-nohemi shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl border-2 border-red-400/30"
        >
          🎲 Generate My Challenge
        </Button>
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
