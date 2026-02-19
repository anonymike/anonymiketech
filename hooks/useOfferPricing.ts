"use client"

export function useOfferPricing() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0

  return {
    isOfferActive: isWeekend,
  }
}
