'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Copy, CheckCircle2, Loader2, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface TechwordPairCodeFlowProps {
  onSuccess?: (sessionData: { code: string; phoneNumber: string }) => void
}

type FlowStep = 'input' | 'generating' | 'code-ready' | 'waiting' | 'error'

export default function TechwordPairCodeFlow({ onSuccess }: TechwordPairCodeFlowProps) {
  const [step, setStep] = useState<FlowStep>('input')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pairingCode, setPairingCode] = useState<string | null>(null)
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)

  // Countdown timer
  useEffect(() => {
    if (step !== 'code-ready') return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setStep('error')
          setError('Code expired. Please generate a new one.')
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [step])

  const formatPhoneNumber = (number: string): boolean => {
    // Basic validation: starts with + and has at least 10 digits
    const cleaned = number.replace(/\D/g, '')
    return cleaned.length >= 10
  }

  const generatePairingCode = async () => {
    setError(null)

    if (!phoneNumber.trim()) {
      setError('Please enter your WhatsApp phone number')
      return
    }

    if (!formatPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +254113313240)')
      return
    }

    try {
      setLoading(true)
      setStep('generating')

      // Call backend to generate pairing code
      const response = await fetch('/api/chatbots/whatsapp/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_techword_code',
          phone_number: phoneNumber.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate pairing code')
      }

      const data = await response.json()
      const code = data.data?.code || 'TECH-WORD'
      
      setPairingCode(code)
      setCountdown(60)

      // Create WhatsApp link
      const cleanedPhone = phoneNumber.replace(/[^\d]/g, '')
      const link = `https://api.whatsapp.com/send/?phone=${cleanedPhone}&text=${encodeURIComponent(code)}&type=phone_number&app_absent=0`
      setWhatsappLink(link)

      setStep('code-ready')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate pairing code'
      setError(errorMsg)
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openWhatsappLink = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank')
    }
  }

  const handleReset = () => {
    setStep('input')
    setPhoneNumber('')
    setPairingCode(null)
    setWhatsappLink(null)
    setError(null)
    setCountdown(60)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-blue-400/5 rounded-full blur-3xl bottom-20 right-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="p-8 space-y-6 bg-slate-900/80 backdrop-blur border-slate-700/50 shadow-2xl">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Techword Pair Code
            </h1>
            <p className="text-sm text-gray-300 max-w-sm mx-auto">
              Enter your WhatsApp number with country code to get your pairing code and link.
            </p>
          </div>

          {/* Step 1: Input Phone Number */}
          {step === 'input' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-200">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +254113313240"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                  className="bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-amber-500"
                />
                <p className="text-xs text-gray-400">
                  Include country code (+ followed by country and number)
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={generatePairingCode}
                disabled={loading || !phoneNumber.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold h-12 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get Code & Link'
                )}
              </Button>
            </motion.div>
          )}

          {/* Step 2: Generating */}
          {step === 'generating' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
              <p className="text-gray-300">Generating your pairing code...</p>
            </motion.div>
          )}

          {/* Step 3: Code Ready */}
          {step === 'code-ready' && pairingCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Code Display */}
              <div className="space-y-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">Your Code</p>
                  <div className="text-3xl font-bold text-blue-400 tracking-widest mb-3 font-mono">
                    {pairingCode}
                  </div>
                  <a href={whatsappLink || '#'} className="text-xs text-blue-300 hover:text-blue-200 underline block">
                    Open WhatsApp Link
                  </a>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-300 bg-slate-800/50 p-3 rounded-lg">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>{Math.floor(countdown / 60)}m {countdown % 60}s remaining</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={copyCode}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold h-12"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>

              {/* Status Message */}
              <div className="text-center text-sm text-gray-400">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Waiting for WhatsApp to link...
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Error */}
          {step === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>

              <Button
                onClick={handleReset}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold h-12"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-3">
            <p className="text-sm font-semibold text-blue-300">How to pair:</p>
            <ol className="text-xs text-gray-300 space-y-2 ml-4 list-decimal">
              <li>Enter your WhatsApp number above</li>
              <li>Click "Get Code & Link" to generate your code</li>
              <li>Either copy the code or open WhatsApp directly</li>
              <li>Send the code to the TECHWORD WhatsApp number</li>
              <li>You&apos;ll receive a session ID to validate</li>
            </ol>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
