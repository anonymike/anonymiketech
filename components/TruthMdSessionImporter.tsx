'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, CheckCircle2, Shield, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface TruthMdSessionImporterProps {
  token?: string
  onSessionValidated?: (sessionData: { session_id: string }) => void
  onBack?: () => void
  showBackButton?: boolean
}

export default function TruthMdSessionImporter({
  token,
  onSessionValidated,
  onBack,
  showBackButton = false,
}: TruthMdSessionImporterProps) {
  const [sessionString, setSessionString] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showExample, setShowExample] = useState(false)

  const validateSessionFormat = (session: string): boolean => {
    // Validate TRUTH-MD format: should start with "TRUTH-MD:~" and contain JSON
    return session.trim().startsWith('TRUTH-MD:~') && session.length > 20
  }

  const handleValidateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!sessionString.trim()) {
      setError('Please paste your TRUTH MD session')
      return
    }

    if (!validateSessionFormat(sessionString)) {
      setError(
        'Invalid session format. Make sure you copied the entire TRUTH-MD:~ string from TRUTH MD'
      )
      return
    }

    try {
      setLoading(true)

      // Validate session format on backend
      const response = await fetch('/api/chatbots/whatsapp/session/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          session_string: sessionString.trim(),
          source: 'truth_md',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to validate session')
      }

      const data = await response.json()
      setSuccess(true)
      setSessionString('')

      // Store session in localStorage for now
      localStorage.setItem('truthmd_session', sessionString.trim())
      localStorage.setItem('session_validated', 'true')

      if (onSessionValidated) {
        onSessionValidated(data.data)
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/chatbots-ai/dashboard'
      }, 2000)
    } catch (err) {
      console.error('[v0] Error validating session:', err)
      setError(err instanceof Error ? err.message : 'Failed to validate session')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-4"
      >
        <Card className="p-8 bg-slate-900/60 border-slate-700 shadow-2xl max-w-md w-full">
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <CheckCircle2 className="h-16 w-16 text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-white">Session Validated!</h3>
            <p className="text-sm text-gray-300">
              Your session has been verified successfully. Redirecting to dashboard...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing
            </div>
          </div>
        </Card>
      </motion.div>
    )
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
          {/* Back Button */}
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Pairing
            </button>
          )}

          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Session Validator</h2>
            <p className="text-sm text-gray-300">
              Paste your session ID below to verify it&apos;s valid and ready to use.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleValidateSession} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session" className="text-gray-200 flex items-center gap-2">
                <span>🔐 Session ID</span>
              </Label>
              <Textarea
                id="session"
                value={sessionString}
                onChange={(e) => setSessionString(e.target.value)}
                placeholder="TRUTH-MD:~eyJ..."
                disabled={loading}
                className="min-h-32 font-mono text-xs bg-slate-800 border-slate-600 text-white placeholder-gray-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-400">
                Paste the entire session string you received from TRUTH MD
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400">Validation Failed</p>
                  <p className="text-xs text-red-300 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading || !sessionString.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Validate Session
                </>
              )}
            </Button>
          </form>

          {/* Info Cards */}
          <div className="space-y-3">
            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300 text-xs">
                Your session must be in the TRUTH-MD:~ format. It will be validated for proper format and authenticity.
              </AlertDescription>
            </Alert>

            <button
              type="button"
              onClick={() => setShowExample(!showExample)}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              {showExample ? 'Hide' : 'Show'} example format
            </button>

            {showExample && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-2"
              >
                <p className="text-xs font-semibold text-white">Example Format:</p>
                <code className="text-xs text-gray-400 break-all block overflow-x-auto">
                  TRUTH-MD:~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbNTYsMTAxLDEwNyw2NiwxNzAsNDYsMTgxLDE1MSwxMjgsMjEx...
                </code>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
