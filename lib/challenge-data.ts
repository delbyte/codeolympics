export interface Challenge {
  constraint: string
  budget: string
  domain: string
  language: string
}

export const challengeData = {
  coreConstraints: [
    "No-Import Rookie -> Only built-in functions, no libraries",
    "Few-Variable Hero -> Maximum 8 variables in entire program",
    "Single-Function Master -> Only 1 function allowed, plus main or entry point",
    "Error-Proof Coder -> Program never crashes and handles all inputs",
    "One-Loop Warrior -> Maximum 1 loop in entire program",
    "Short-Name Ninja -> Variable names maximum 3 characters",
    "Fast-Response Builder -> Must load or respond in under 2 seconds",
    "Simple-State Creator -> Program has exactly 2-3 modes or states",
  ],
  lineBudgets: [
    "Tiny Scripter -> 50 lines maximum",
    "Mini Builder -> 100 lines maximum",
    "Compact Coder -> 150 lines maximum",
    "Standard Maker -> 200 lines maximum",
    "Detailed Creator -> 300 lines maximum",
    "Feature-Rich Dev -> 400 lines maximum",
    "Professional Builder -> 500 lines maximum",
    "Enterprise Creator -> 650 lines maximum",
  ],
  projectDomains: [
    "Simple Games -> Tic-tac-toe, hangman, word games, puzzle solvers",
    "Basic Tools -> Calculators, converters, generators, encoders",
    "Text Processing -> Editors, analyzers, formatters, search tools",
    "Number Crunching -> Math tools, statistics, algorithms, solvers",
    "File Management -> Organizers, readers, processors, diff tools",
    "Quiz Systems -> Trivia, flashcards, learning tools, assessments",
    "Visual Creation -> ASCII art, charts, graphics, terminal UIs",
    "Mini Databases -> Records, inventory, contacts, key-value stores",
    "Data Processing -> Parsers, transformers, pipeline tools, validators",
    "System Utilities -> Monitors, cleaners, automation, health checks",
  ],
  languages: [
    "Python -> Readable, versatile, forgiving, but can you optimize it?",
    "JavaScript -> Async-first and prototype-based, familiar but slippery",
    "TypeScript -> JavaScript with type discipline and stricter tradeoffs",
    "Go -> Simple by design, explicit by nature, built for clarity",
    "Rust -> Ownership, lifetimes, and a compiler that keeps score",
    "Ruby -> Expressive blocks, duck typing, and elegant constraints",
    "C -> Raw memory, manual control, and no safety net",
    "Java -> Enterprise structure squeezed into a compact build",
    "Bash -> Pipes, redirects, and text processing under pressure",
    "PHP -> Practical web scripting with a surprisingly sharp edge",
  ],
}

function randomItem(items: string[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export function generateRandomChallenge(): Challenge {
  return {
    constraint: randomItem(challengeData.coreConstraints),
    budget: randomItem(challengeData.lineBudgets),
    domain: randomItem(challengeData.projectDomains),
    language: randomItem(challengeData.languages),
  }
}

export function parseChallengePart(part: string) {
  const [title, ...descriptionParts] = part.split(" -> ")

  return {
    title,
    description: descriptionParts.join(" -> "),
  }
}
