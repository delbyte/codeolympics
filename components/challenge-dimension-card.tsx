import { Badge } from "@/components/ui/badge"
import { parseChallengePart } from "@/lib/challenge-data"
import { cn } from "@/lib/utils"

interface ChallengeDimensionCardProps {
  dimension: number
  label: string
  tagline: string
  value: string
  accent: "blue" | "gold" | "green" | "red"
  compact?: boolean
}

const accentClasses = {
  blue: {
    badge: "border-[#0081c8]/30 bg-[#0081c8]/10 text-[#8ccfff]",
    title: "text-[#8ccfff]",
    ring: "border-[#0081c8]/25",
  },
  gold: {
    badge: "border-gold/30 bg-gold/10 text-gold-light",
    title: "text-gold-light",
    ring: "border-gold/25",
  },
  green: {
    badge: "border-[#00a651]/30 bg-[#00a651]/10 text-[#8ff0b8]",
    title: "text-[#8ff0b8]",
    ring: "border-[#00a651]/25",
  },
  red: {
    badge: "border-[#ee334e]/30 bg-[#ee334e]/10 text-[#ff97a6]",
    title: "text-[#ff97a6]",
    ring: "border-[#ee334e]/25",
  },
}

export function ChallengeDimensionCard({
  dimension,
  label,
  tagline,
  value,
  accent,
  compact = false,
}: ChallengeDimensionCardProps) {
  const parsed = parseChallengePart(value)
  const styles = accentClasses[accent]

  return (
    <div className={cn("glass-card rounded-lg p-5", styles.ring, compact && "p-4")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">Dimension {dimension}</p>
          <h3 className={cn("mt-2 font-display text-lg font-semibold leading-tight", styles.title)}>{label}</h3>
        </div>
        <Badge className={cn("shrink-0 rounded-full border px-3 py-1 font-mono text-[10px]", styles.badge)}>
          D{dimension}
        </Badge>
      </div>

      <p className="mt-1 text-xs text-fg-muted">{tagline}</p>
      <p className={cn("mt-4 font-display font-semibold text-fg", compact ? "text-base" : "text-lg")}>
        {parsed.title}
      </p>
      {parsed.description && <p className="mt-2 text-sm leading-relaxed text-fg-muted">{parsed.description}</p>}
    </div>
  )
}
