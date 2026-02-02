// New file to handle date-based feature visibility

export function isNewYearActive(): boolean {
  const currentDate = new Date()
  const newYearStart = new Date(2026, 0, 1) // January 1, 2026
  const newYearEnd = new Date(2026, 1, 1) // February 1, 2026

  return currentDate >= newYearStart && currentDate < newYearEnd
}

export function getCurrentYear(): number {
  return new Date().getFullYear()
}
