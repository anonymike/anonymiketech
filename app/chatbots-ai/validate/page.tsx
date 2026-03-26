'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TruthMdSessionImporter from '@/components/TruthMdSessionImporter'

export default function SessionValidationPage() {
  const router = useRouter()
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chatbot_token') || ''
    }
    return ''
  })

  const handleSessionValidated = (sessionData: any) => {
    // Session is already stored in localStorage in TruthMdSessionImporter
    // Redirect to dashboard
    setTimeout(() => {
      router.push('/chatbots-ai/dashboard')
    }, 1500)
  }

  return (
    <TruthMdSessionImporter
      token={token}
      onSessionValidated={handleSessionValidated}
      showBackButton={false}
    />
  )
}
