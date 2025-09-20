"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface ChallengeAcceptedProps {
  isVisible: boolean
  challengeDetails: {
    title: string
    difficulty: string
    timeLimit: string
  }
  onComplete: () => void
}

export function ChallengeAccepted({ isVisible, challengeDetails, onComplete }: ChallengeAcceptedProps) {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const duration = 5000 // 5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progressPercent = Math.min((elapsed / duration) * 100, 100)
      const secondsLeft = Math.max(Math.ceil((duration - elapsed) / 1000), 0)
      
      setProgress(progressPercent)
      setTimeLeft(secondsLeft)

      if (elapsed >= duration) {
        clearInterval(interval)
        onComplete()
        // Redirect to Discord
        window.open("https://discord.com/invite/xfYPDZYqeh", "_blank")
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 opacity-20 pointer-events-none">
        <Image
          src="/images/codeolymics_circles.svg"
          alt="Decorative circles"
          width={64}
          height={64}
        />
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-20 h-20 opacity-25 pointer-events-none">
        <Image
          src="/images/codeolymics_circles.svg"
          alt="Decorative circles"
          width={80}
          height={80}
        />
      </div>
      <div className="absolute top-1/3 right-1/3 w-12 h-12 opacity-30 pointer-events-none">
        <Image
          src="/images/codeolymics_circles.svg"
          alt="Decorative circles"
          width={48}
          height={48}
        />
      </div>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-blue-200 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Challenge Accepted! 🎉
          </CardTitle>
          <CardDescription className="text-gray-600">
            Thank you for joining Code Olympics! Your challenge details:
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Challenge:</span>
              <span className="text-blue-700 font-medium">{challengeDetails.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Difficulty:</span>
              <span className="text-orange-600 font-medium">{challengeDetails.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Time Limit:</span>
              <span className="text-red-600 font-medium">{challengeDetails.timeLimit}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Redirecting to Discord in {timeLeft}s...
              </span>
              <span className="text-sm text-blue-600 font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>Join our Discord community to:</p>
            <ul className="text-xs space-y-1">
              <li>• Connect with other participants</li>
              <li>• Get support and ask questions</li>
              <li>• Share your progress</li>
              <li>• Access exclusive resources</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}