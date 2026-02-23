/**
 * Generate stable "random" values based on seed for SSR/hydration safety
 * This ensures server and client generate the same values
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * Generate animation delay from index (safe for hydration)
 */
export function getAnimationDelay(index: number): string {
  const delay = seededRandom(index * 7) * 5
  return `${delay.toFixed(2)}s`
}

/**
 * Generate animation duration from index (safe for hydration)
 */
export function getAnimationDuration(index: number): string {
  const duration = 3 + seededRandom(index * 11) * 4
  return `${duration.toFixed(2)}s`
}
