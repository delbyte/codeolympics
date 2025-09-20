"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface ChallengeAcceptedProps {
  isVisible: boolean
  challenge: {
    constraint: string
    budget: string
    domain: string
  }
  onComplete: () => void
}

export function ChallengeAccepted({ isVisible, challenge, onComplete }: ChallengeAcceptedProps) {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)

  const parseChallengePart = (part: string) => {
    const [title, description] = part.split(" → ")
    return { title, description }
  }

  const constraint = parseChallengePart(challenge.constraint)
  const budget = parseChallengePart(challenge.budget)
  const domain = parseChallengePart(challenge.domain)

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

      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <Card className="border-2 border-green-200 bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold text-green-700 font-nohemi">
              Challenge Accepted!
            </CardTitle>
            <CardDescription className="text-gray-600 font-nohemi text-lg">
              Thank you for joining Code Olympics! Here's your accepted challenge:
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Challenge Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Core Constraint */}
          <Card className="border-2 border-red-200 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-nohemi text-red-600">Core Constraint</CardTitle>
                <Badge className="bg-red-100 text-red-800 border border-red-200 font-nohemi">
                  Dimension 1
                </Badge>
              </div>
              <CardDescription className="font-nohemi text-gray-600">What you can't use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-bold text-red-700 font-nohemi text-lg">{constraint.title}</h3>
                <p className="text-sm text-gray-700 font-nohemi leading-relaxed">{constraint.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Line Budget */}
          <Card className="border-2 border-blue-200 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-nohemi text-blue-600">Line Budget</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 border border-blue-200 font-nohemi">
                  Dimension 2
                </Badge>
              </div>
              <CardDescription className="font-nohemi text-gray-600">How much you can write</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-bold text-blue-700 font-nohemi text-lg">{budget.title}</h3>
                <p className="text-sm text-gray-700 font-nohemi leading-relaxed">{budget.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Project Domain */}
          <Card className="border-2 border-green-200 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-nohemi text-green-600">Project Domain</CardTitle>
                <Badge className="bg-green-100 text-green-800 border border-green-200 font-nohemi">
                  Dimension 3
                </Badge>
              </div>
              <CardDescription className="font-nohemi text-gray-600">What you build</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-bold text-green-700 font-nohemi text-lg">{domain.title}</h3>
                <p className="text-sm text-gray-700 font-nohemi leading-relaxed">{domain.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenge Summary with Progress */}
        <Card className="border-2 border-purple-200 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-nohemi text-purple-700">Your Challenge Summary</CardTitle>
            <CardDescription className="font-nohemi text-gray-600 text-lg">
              Build this combination for the Code Olympics hackathon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-lg font-nohemi text-gray-900 leading-relaxed">
                Create a <span className="font-bold text-green-600">{domain.title.toLowerCase()}</span> project with the <span className="font-bold text-blue-600">{budget.title.toLowerCase()}</span> limit while following the <span className="font-bold text-red-600">{constraint.title.toLowerCase()}</span> constraint.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700 font-nohemi">
                  Redirecting to Discord in {timeLeft}s...
                </span>
                <span className="text-lg text-purple-600 font-medium font-nohemi">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-4" />
            </div>

            <div className="text-center font-nohemi text-gray-600 space-y-2">
              <p className="text-lg font-semibold">Join our Discord community to:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Connect with other participants</div>
                <div>• Get support and ask questions</div>
                <div>• Share your progress</div>
                <div>• Access exclusive resources</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}