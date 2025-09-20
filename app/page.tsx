"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EmailForm } from "@/components/email-form"
import { MobileLockout } from "@/components/mobile-lockout"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const handleEmailSubmitted = (email: string, username: string) => {
    // Redirect to challenge page with email and username as query params
    router.push(`/challenge?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Mobile lockout overlay */}
      {isMobile && <MobileLockout />}

      {/* Decorative ribbons on edges - massive and mostly cut off */}
      <div className="absolute top-16 -left-64 z-10">
        <Image
          src="/images/ribbons.png"
          alt="Decorative ribbon"
          width={600}
          height={360}
          className=""
        />
      </div>

      {/* Decorative circles - overlapping near bottom right */}
      <div className="absolute bottom-20 right-32 z-10">
        <Image
          src="/images/codeolymics_circles.svg"
          alt="Decorative circles"
          width={200}
          height={200}
        />
      </div>
      <div className="absolute bottom-8 right-16 z-10">
        <Image
          src="/images/codeolymics_circles.svg"
          alt="Decorative circles"
          width={160}
          height={160}
        />
      </div>
      <div className="absolute bottom-30 right-12 z-10">
        <Image
          src="/images/codeolymics_circles.svg"
          alt="Decorative circles"
          width={120}
          height={120}
        />
      </div>

      {/* Video Section */}
      <section className="relative h-screen flex items-center justify-center bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

        <div className="relative z-10 text-center space-y-8 px-4">
          <div className="space-y-6">
            <h1 className="text-[129px] font-normal text-[#f73c13] font-nohemi leading-none" style={{ textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' }}>
              Code Olympics
            </h1>
            <p className="text-3xl text-blue font-nohemi drop-shadow-lg">
              <span className="bg-white text-black px-6 py-3 rounded-full drop-shadow-lg font-medium border border-white/30">
                The Elite Constraint Programming Championship
              </span>
            </p>
            <div className="flex items-center justify-center space-x-6 text-xl text-white font-nohemi drop-shadow-lg">
              <span className="bg-white text-black px-6 py-3 rounded-full drop-shadow-lg font-medium border border-white/30">
                3-Day Global Challenge
              </span>
              <span className="bg-white text-black px-6 py-3 rounded-full drop-shadow-lg font-medium border border-white/30">
                Oct. 31 — Nov. 3, 2025
              </span>
            </div>
          </div>

          <EmailForm onEmailSubmitted={handleEmailSubmitted} />
        </div>
      </section>
    </main>
  )
}
