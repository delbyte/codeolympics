"use client"

import { useState } from "react"
import { EmailForm } from "@/components/email-form"
import { ChallengeVisualizer } from "@/components/challenge-visualizer"
import Image from "next/image"
import { DEV_BYPASS } from "@/lib/firebase"

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [discordUsername, setDiscordUsername] = useState<string | null>(null)

  const handleEmailSubmitted = (email: string, username: string) => {
    setUserEmail(email)
    setDiscordUsername(username)
  }

  return (
    <main className="min-h-screen bg-white">
      {DEV_BYPASS && <div className="fixed top-4 right-4 z-50 dev-bypass-indicator">DEV_BYPASS MODE ACTIVE</div>}

      {/* Video Section */}
      <section className={`relative ${userEmail ? 'min-h-screen' : 'h-screen'} flex items-center justify-center bg-black`}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          poster="/images/abstract-logo.png"
          onError={(e) => {
            console.error('Video failed to load:', e);
            // Fallback to a gradient background
            e.currentTarget.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black';
            e.currentTarget.parentNode?.appendChild(fallback);
          }}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
          onPlay={() => console.log('Video started playing')}
          onLoadedData={() => console.log('Video data loaded')}
        >
          <source
            src="/codeolympics_vid.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        <div className="relative z-10 w-full">
          {!userEmail ? (
            <div className="text-center space-y-8 px-4">


              <div className="space-y-6">
                <h1 className="text-8xl font-bold text-white font-nohemi animate-pulse drop-shadow-2xl">
                  Code Olympics
                </h1>
                <p className="text-3xl text-white font-nohemi drop-shadow-lg">The Elite Constraint Programming Championship</p>
                <div className="flex items-center justify-center space-x-6 text-xl text-white font-nohemi drop-shadow-lg">
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full drop-shadow-lg font-medium border border-red-400/30">
                    3-Day Global Challenge
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-full drop-shadow-lg font-medium border border-blue-400/30">
                    Oct. 31 — Nov. 3, 2025
                  </span>
                </div>
              </div>

              <EmailForm onEmailSubmitted={handleEmailSubmitted} />

              <div className="max-w-2xl">
                <p className="text-white font-nohemi drop-shadow-lg text-lg leading-relaxed">
                  Get your unique combination of constraints, line limits, and project domains.
                </p>
                <p className="text-gray-200 font-nohemi drop-shadow-md text-base mt-3">
                  Each email can only participate once to ensure fairness.
                </p>
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-4 py-16">
              <ChallengeVisualizer userEmail={userEmail} discordUsername={discordUsername} />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
