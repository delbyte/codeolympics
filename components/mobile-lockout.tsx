"use client"

import { Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileLockout() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-0/85 p-4 text-fg backdrop-blur-xl">
      <section className="glass-card-featured w-full max-w-md rounded-lg p-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <Monitor className="size-7" />
        </div>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-gold">Desktop required</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Use a larger screen</h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          The tesseract generator is designed for the full Code Olympics desktop experience.
        </p>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left text-sm text-fg-muted">
          <p>A laptop or desktop browser gives you enough room to inspect and save your 4D challenge.</p>
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="mt-6 h-11 w-full rounded-full bg-gold font-bold text-surface-0 hover:bg-gold-light"
        >
          Refresh Page
        </Button>
      </section>
    </div>
  )
}
