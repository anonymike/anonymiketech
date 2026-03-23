'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Phone, Loader2, Copy, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  token?: string
  onPaired?: () => void
  onBack?: () => void
}

type PairingStep = 'start' | 'generating' | 'waiting' | 'paste_code' | 'validating' | 'success'

export default function WhatsAppPairingPage({
  token,
  onPaired,
  onBack,
}: Props) {
  const [step, setStep] = useState<PairingStep>('start')
  const [pairingCode, setPairingCode] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pastedCode, setPastedCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const generatePairingSession = async () => {
    try {
      setLoading(true)
      setError(null)
      setStep('generating')

      const response = await fetch('/api/chatbots/whatsapp/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'generate_pairing_session',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate pairing session')
      }

      const data = await response.json()
      setPairingCode(data.data.pairingCode || data.data.session_code)
      setStep('waiting')
    } catch (err) {
      console.error('[v0] Error generating session:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate pairing session')
      setStep('start')
    } finally {
      setLoading(false)
    }
  }

  const validatePairingCode = async () => {
    try {
      if (!pastedCode.trim()) {
        setError('Please paste the code you received')
        return
      }

      setLoading(true)
      setError(null)
      setStep('validating')

      const response = await fetch('/api/chatbots/whatsapp/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'validate_pairing_code',
          pairing_code: pastedCode.trim(),
          phone_number: phoneNumber.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Invalid pairing code')
      }

      const data = await response.json()
      setStep('success')
      setTimeout(() => {
        onPaired?.()
      }, 2000)
    } catch (err) {
      console.error('[v0] Error validating code:', err)
      setError(err instanceof Error ? err.message : 'Failed to validate pairing code')
      setStep('paste_code')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleReset = () => {
    setStep('start')
    setPairingCode(null)
    setPhoneNumber('')
    setPastedCode('')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 space-y-6 bg-slate-900/50 border-slate-800">
          {/* Header with Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-white">WhatsApp Pairing</h2>
            <p className="text-sm text-gray-400">
              {step === 'start' && 'Link your WhatsApp account to create bots'}
              {step === 'generating' && 'Generating pairing session...'}
              {step === 'waiting' && 'Check your WhatsApp for the pairing code'}
              {step === 'paste_code' && 'Paste the code you received'}
              {step === 'validating' && 'Validating your pairing code...'}
              {step === 'success' && 'WhatsApp account linked successfully!'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 flex gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Step 1: Start */}
          {step === 'start' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-blue-400" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-white">Ready to pair?</h3>
                  <p className="text-sm text-gray-300">
                    We'll send a pairing code to your WhatsApp. Make sure you have WhatsApp installed on your phone.
                  </p>
                </div>
              </div>

              <Button
                onClick={generatePairingSession}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Pairing Code'
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Your WhatsApp number will be securely linked to your account
              </p>
            </motion.div>
          )}

          {/* Step 2: Generating */}
          {step === 'generating' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4 py-8"
            >
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-center text-sm text-gray-400">
                Generating your pairing session...
              </p>
            </motion.div>
          )}

          {/* Step 3: Waiting for Code */}
          {step === 'waiting' && pairingCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm text-gray-300">Your Pairing Code</Label>
                  <div className="flex items-center gap-2 bg-black/50 rounded-lg p-4 border border-emerald-500/30">
                    <code className="flex-1 font-mono text-lg font-bold text-emerald-400 tracking-widest">
                      {pairingCode}
                    </code>
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-xs text-emerald-400">✓ Copied to clipboard</p>
                  )}
                </div>

                <div className="bg-slate-800/50 rounded p-3 space-y-2">
                  <p className="text-xs font-semibold text-white">How to use:</p>
                  <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Open WhatsApp on your phone</li>
                    <li>Go to Settings → Linked Devices</li>
                    <li>Tap "Link a Device"</li>
                    <li>Paste this code when prompted</li>
                  </ol>
                </div>
              </div>

              <Button
                onClick={() => setStep('paste_code')}
                className="w-full"
                variant="outline"
              >
                I've Pasted the Code
              </Button>

              <p className="text-xs text-center text-gray-500">
                Code expires in 60 seconds. Generate a new one if needed.
              </p>
            </motion.div>
          )}

          {/* Step 4: Paste Code */}
          {step === 'paste_code' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loading}
                    className="bg-slate-800 border-slate-700"
                  />
                  <p className="text-xs text-gray-500">
                    Enter the phone number associated with your WhatsApp (helps with validation)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Paste Your WhatsApp Pairing Code</Label>
                  <Input
                    id="code"
                    placeholder="Paste the code from your WhatsApp here"
                    value={pastedCode}
                    onChange={(e) => setPastedCode(e.target.value.toUpperCase())}
                    disabled={loading}
                    className="bg-slate-800 border-slate-700 font-mono text-lg"
                  />
                  <p className="text-xs text-gray-500">
                    Copy the pairing code from your WhatsApp linked devices screen
                  </p>
                </div>
              </div>

              <Button
                onClick={validatePairingCode}
                disabled={loading || !pastedCode.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate Code'
                )}
              </Button>

              <Button
                onClick={generatePairingSession}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                Generate New Code
              </Button>
            </motion.div>
          )}

          {/* Step 5: Validating */}
          {step === 'validating' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4 py-8"
            >
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
              <p className="text-center text-sm text-gray-400">
                Validating your pairing code...
              </p>
            </motion.div>
          )}

          {/* Step 6: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 space-y-4 text-center">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    WhatsApp Linked Successfully!
                  </h3>
                  <p className="text-sm text-gray-300">
                    Your WhatsApp account has been paired. You can now create and deploy bots.
                  </p>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500">
                Redirecting to dashboard...
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
