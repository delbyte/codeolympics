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
  blue: "text-[#8ccfff]",
  gold: "text-gold-light",
  green: "text-[#8ff0b8]",
  red: "text-[#ff97a6]",
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

  return (
    <div className={cn("glass-pill rounded-lg p-4", compact && "p-3")}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">D{dimension}</p>
        <p className="text-xs text-fg-muted">{label}</p>
      </div>

      <h3 className={cn("mt-3 font-semibold leading-tight", accentClasses[accent], compact ? "text-base" : "text-lg")}>
        {parsed.title}
      </h3>
      <p className="mt-1 text-xs text-fg-muted">{tagline}</p>
      {parsed.description && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{parsed.description}</p>}
    </div>
  )
}
