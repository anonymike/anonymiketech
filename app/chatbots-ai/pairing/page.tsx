'use client'

import { useEffect } from 'react'

export default function PairingPage() {
  useEffect(() => {
    // Redirect to TRUTH MD pairing platform
    window.location.href = 'https://truth-md.courtneytech.xyz/'
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🔄</div>
        <h1 className="text-2xl font-bold text-white">Redirecting to TRUTH MD...</h1>
        <p className="text-gray-300">You will be redirected to the TRUTH MD pairing platform shortly.</p>
        <p className="text-sm text-gray-400 mt-6">
          If you are not redirected automatically, <a href="https://truth-md.courtneytech.xyz/" className="text-blue-400 hover:text-blue-300 underline">click here</a>
        </p>
      </div>
    </div>
  )
}
