export const challengeData = {
  coreConstraints: [
    "No-Import Rookie → Only built-in functions, no libraries",
    "Few-Variable Hero → Maximum 8 variables in entire program",
    "Single-Function Master → Only 1 function allowed (plus main)",
    "Error-Proof Coder → Program never crashes, handles all inputs",
    "One-Loop Warrior → Maximum 1 loop in entire program",
    "Short-Name Ninja → Variable names maximum 3 characters",
    "FastResponse Builder → Must load/respond in under 2 seconds",
    "Simple-State Creator → Program has 2-3 different modes/states",
  ],
  lineBudgets: [
    "Tiny Scripter → 50 lines maximum",
    "Mini Builder → 100 lines maximum",
    "Compact Coder → 150 lines maximum",
    "Standard Maker → 200 lines maximum",
    "Detailed Creator → 300 lines maximum",
    "Feature-Rich Dev → 400 lines maximum",
    "Professional Builder → 500 lines maximum",
    "Enterprise Creator → 650 lines maximum",
  ],
  projectDomains: [
    "Simple Games → Tic-tac-toe, hangman, word games",
    "Basic Tools → Calculators, converters, generators",
    "Text Processing → Editors, analyzers, formatters",
    "Number Crunching → Math tools, statistics, algorithms",
    "File Management → Organizers, readers, processors",
    "Quiz Systems → Trivia, flashcards, learning tools",
    "Visual Creation → ASCII art, charts, graphics",
    "Mini Databases → Records, inventory, contacts",
    "Web Scrapers → Data collectors, parsers",
    "System Utilities → Monitors, cleaners, automation",
  ],
}

export function generateRandomChallenge() {
  const constraint = challengeData.coreConstraints[Math.floor(Math.random() * challengeData.coreConstraints.length)]
  const budget = challengeData.lineBudgets[Math.floor(Math.random() * challengeData.lineBudgets.length)]
  const domain = challengeData.projectDomains[Math.floor(Math.random() * challengeData.projectDomains.length)]

  return { constraint, budget, domain }
}
