"use client"

import { useRouter } from "next/navigation"
import { EmailForm } from "@/components/email-form"
import { MobileLockout } from "@/components/mobile-lockout"
import { SiteHeader } from "@/components/site-header"
import { TesseractAnimation } from "@/components/tesseract-animation"
import { useIsMobile } from "@/hooks/use-mobile"

export default function HomePage() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const handleEmailSubmitted = (email: string, username: string) => {
    router.push(`/challenge?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-surface-1 text-fg">
      {isMobile && <MobileLockout />}
      <SiteHeader />

      <section className="container relative grid min-h-[calc(100vh-88px)] items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
        <div className="relative z-10">
          <p className="mb-5 font-mono text-xs text-fg-muted/70 sm:text-sm">
            <span className="text-gold/50">//</span> Code Olympics 2026
            <span className="ml-1 inline-block h-[1em] w-[2px] align-middle bg-gold/60 animate-pulse" />
          </p>

          <h1 className="hero-title font-display text-5xl font-semibold leading-[1.05] drop-shadow-lg sm:text-6xl lg:text-7xl">
            Generate Your 4D Challenge
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="glass-pill-gold rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-gold">
              4D Global Challenge
            </span>
            <span className="glass-pill rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-fg-muted">
              Summer 2026
            </span>
          </div>

          <p className="mt-6 max-w-xl text-xl leading-relaxed text-fg-muted">
            Four random constraints. One assigned language. Up to three spins before you commit.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {["Constraint", "Budget", "Domain", "Language"].map((item, index) => (
              <div key={item} className="glass-card-ghost rounded-lg p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">D{index + 1}</p>
                <p className="mt-1 text-sm font-semibold text-fg">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <TesseractAnimation isAnimating={false} playCount={0} />
          <EmailForm onEmailSubmitted={handleEmailSubmitted} />
        </div>
      </section>
    </main>
  )
}
