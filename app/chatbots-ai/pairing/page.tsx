'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TechwordPairCodeFlow from '@/components/TechwordPairCodeFlow'

export default function PairingPage() {
  const router = useRouter()

  const handlePairingSuccess = () => {
    // User will be directed to validate their session
    setTimeout(() => {
      router.push('/chatbots-ai/validate')
    }, 1000)
  }

  return (
    <TechwordPairCodeFlow
      onSuccess={handlePairingSuccess}
    />
  )
}
