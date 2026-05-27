"use client"

import Link from "next/link"

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-40 flex justify-center px-4 pt-4">
      <header className="glass-card w-full max-w-6xl rounded-lg border-border/50 bg-surface-0/40 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="font-mono text-xs font-bold tracking-[0.15em] text-fg sm:text-sm">
            CODE<span className="text-gold">&nbsp;OLYMPICS</span>
          </Link>

          <a
            href="https://discord.com/invite/xfYPDZYqeh"
            target="_blank"
            rel="noreferrer"
            className="glass-pill-gold rounded-full px-4 py-2 text-xs font-semibold text-gold transition-all hover:border-gold hover:bg-gold/10 sm:text-sm"
          >
            Join Discord
          </a>
        </div>
      </header>
    </div>
  )
}
