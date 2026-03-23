'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, QrCode, Copy, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  botId: string
  token?: string
  onLinked?: () => void
}

type LinkingMethod = 'qr' | 'code'

export default function WhatsAppBotLinkingPanel({
  botId,
  token,
  onLinked,
}: Props) {
  const [method, setMethod] = useState<LinkingMethod>('qr')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [pairingCode, setPairingCode] = useState<string>('')
  const [isLinked, setIsLinked] = useState(false)
  const [linkedPhone, setLinkedPhone] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Fetch initial status and QR code
  useEffect(() => {
    fetchLinkingStatus()
    const interval = setInterval(fetchLinkingStatus, 3000)
    return () => clearInterval(interval)
  }, [botId, token])

  const fetchLinkingStatus = async () => {
    try {
      setLoading(false)
      const response = await fetch(
        `/api/chatbots/whatsapp/bots/${botId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch status')
      }

      const data = await response.json()
      const { isLinked: linked, linkedPhoneNumber, qrCode: qr } = data.data

      if (linked) {
        setIsLinked(true)
        setLinkedPhone(linkedPhoneNumber)
        setPolling(false)
        onLinked?.()
      } else {
        setIsLinked(false)
        if (qr) {
          setQrCode(qr)
        }
      }
    } catch (err) {
      console.error('[v0] Error fetching linking status:', err)
      setError('Failed to fetch linking status')
    }
  }

  const generatePairingCode = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/chatbots/whatsapp/bots/${botId}/pair`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ method: 'code' }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate pairing code')
      }

      const data = await response.json()
      setPairingCode(data.data.pairingCode)
      setPolling(true)
    } catch (err) {
      console.error('[v0] Error generating pairing code:', err)
      setError('Failed to generate pairing code')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLinked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="p-6 space-y-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                WhatsApp Account Linked
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your WhatsApp account has been successfully paired
              </p>
              {linkedPhone && (
                <p className="text-sm font-mono text-green-700 dark:text-green-300 mt-2">
                  {linkedPhone}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={onLinked}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Continue to Configuration
          </Button>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Link WhatsApp Account</h3>
          <p className="text-sm text-muted-foreground">
            Connect your WhatsApp account to enable the bot
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 flex gap-2">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Method Selection */}
        <div className="space-y-3">
          <Label>Select Linking Method</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMethod('qr')}
              className={`p-3 rounded-lg border-2 transition-all ${
                method === 'qr'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground'
              }`}
            >
              <QrCode className="h-5 w-5 mx-auto mb-1" />
              <p className="text-xs font-medium">Scan QR Code</p>
            </button>
            <button
              onClick={() => setMethod('code')}
              className={`p-3 rounded-lg border-2 transition-all ${
                method === 'code'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground'
              }`}
            >
              <p className="text-2xl mb-1">##</p>
              <p className="text-xs font-medium">Pairing Code</p>
            </button>
          </div>
        </div>

        {/* QR Code Method */}
        {method === 'qr' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Scan with Your WhatsApp</Label>
              <p className="text-xs text-muted-foreground">
                Open WhatsApp on your phone and scan this QR code using the WhatsApp app to link your account
              </p>
            </div>

            {qrCode ? (
              <div className="flex justify-center bg-muted p-4 rounded-lg">
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="w-48 h-48"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center bg-muted p-12 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              QR code will refresh every 60 seconds
            </p>
          </motion.div>
        )}

        {/* Pairing Code Method */}
        {method === 'code' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Pairing Code</Label>
              <p className="text-xs text-muted-foreground">
                Use this 8-character code to pair your WhatsApp account
              </p>
            </div>

            {pairingCode ? (
              <div className="space-y-3">
                <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
                  <p className="font-mono text-lg font-bold tracking-widest">
                    {pairingCode}
                  </p>
                  <Button
                    onClick={copyToClipboard}
                    variant="ghost"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✓ Copied to clipboard
                  </p>
                )}
              </div>
            ) : (
              <Button
                onClick={generatePairingCode}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Pairing Code'
                )}
              </Button>
            )}

            {pairingCode && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  <strong>How to use:</strong> Go to WhatsApp Settings {'>'} Linked Devices {'>'} Link a Device and enter this code
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Polling Indicator */}
        {polling && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Waiting for connection...
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          disabled={loading || isLinked}
        >
          Skip for Now
        </Button>
      </Card>
    </motion.div>
  )
}
