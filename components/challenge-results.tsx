"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { saveAcceptedCombo } from "@/lib/firebase"

interface Challenge {
  constraint: string
  budget: string
  domain: string
}

interface ChallengeResultsProps {
  challenge: Challenge
  onNewChallenge: () => void
  playCount: number
  userEmail: string
}

export function ChallengeResults({ challenge, onNewChallenge, playCount, userEmail }: ChallengeResultsProps) {
  const parseChallengePart = (part: string) => {
    const [title, description] = part.split(" → ")
    return { title, description }
  }

  const constraint = parseChallengePart(challenge.constraint)
  const budget = parseChallengePart(challenge.budget)
  const domain = parseChallengePart(challenge.domain)

  const handleAcceptCombo = async () => {
    await saveAcceptedCombo(userEmail, challenge)
    // Could add a success message or redirect here
  }

  const isLastAttempt = playCount >= 3

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 font-nohemi">Your Code Olympics Challenge</h2>
        <p className="text-xl text-gray-700 font-nohemi">Here's your unique combination to build for the hackathon!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Core Constraint */}
        <Card className="border-2 border-red-200 bg-white shadow-xl rounded-xl">
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
        <Card className="border-2 border-blue-200 bg-white shadow-xl rounded-xl">
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
        <Card className="border-2 border-green-200 bg-white shadow-xl rounded-xl">
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

      {/* Challenge Summary */}
      <Card className="border-2 border-gray-200 bg-white shadow-xl rounded-xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-nohemi text-gray-900">Your Challenge Summary</CardTitle>
          <CardDescription className="font-nohemi text-gray-600 text-lg">
            Build this combination for the Code Olympics hackathon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-lg font-nohemi text-gray-900 leading-relaxed">
                Create a <span className="font-bold text-green-600">{domain.title.toLowerCase()}</span> project with the <span className="font-bold text-blue-600">{budget.title.toLowerCase()}</span> limit while following the <span className="font-bold text-red-600">{constraint.title.toLowerCase()}</span> constraint.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {!isLastAttempt ? (
                <>
                  <Button onClick={onNewChallenge} variant="outline" className="flex-1 font-nohemi bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 py-3">
                    Decline & Try Again ({3 - playCount} attempts left)
                  </Button>
                  <Button
                    onClick={handleAcceptCombo}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-nohemi font-bold py-3 rounded-lg border border-green-500 shadow-lg"
                  >
                    Accept This Challenge
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleAcceptCombo}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-nohemi font-bold py-4 rounded-lg border border-purple-500 shadow-lg"
                >
                  Accept Challenge (Final Attempt)
                </Button>
              )}
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-nohemi font-bold py-3 rounded-lg border border-blue-500 shadow-lg"
                onClick={() => {
                  // Copy challenge to clipboard
                  const challengeText = `Code Olympics Challenge:\n\nCore Constraint: ${challenge.constraint}\nLine Budget: ${challenge.budget}\nProject Domain: ${challenge.domain}`
                  navigator.clipboard.writeText(challengeText)
                }}
              >
                Copy Challenge Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-2 border-amber-200 bg-white shadow-xl rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-nohemi text-amber-700">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 font-nohemi text-gray-700 leading-relaxed">
            <p>1. Save or screenshot your challenge details</p>
            <p>2. Join the Discord community for support and updates</p>
            <p>3. Start building your project following the constraints</p>
            <p>4. Submit your solution during the competition period</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
