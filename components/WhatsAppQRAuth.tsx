'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertTriangle, CheckCircle2, XCircle, Copy } from 'lucide-react'

interface WhatsAppQRAuthProps {
  botId: string
  userId: string
  onAuthSuccess: (phoneNumber: string) => void
  onAuthFailed: (error: string) => void
}

export function WhatsAppQRAuth({
  botId,
  userId,
  onAuthSuccess,
  onAuthFailed,
}: WhatsAppQRAuthProps) {
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'initiating' | 'waiting' | 'authenticated' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Initiate QR authentication
  const initiateQRAuth = useCallback(async () => {
    try {
      setStatus('initiating')
      setError(null)

      const response = await fetch('/api/chatbots/whatsapp/auth/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initiate',
          botId,
          sessionId,
          userId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to initiate QR auth')
      }

      setStatus('waiting')

      // Start polling for QR code and status
      pollSessionStatus()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      setStatus('error')
      onAuthFailed(errorMsg)
    }
  }, [botId, sessionId, userId, onAuthFailed])

  // Poll session status
  const pollSessionStatus = useCallback(async () => {
    let attempts = 0
    const maxAttempts = 240 // 2 minutes with 500ms interval

    const interval = setInterval(async () => {
      attempts++

      try {
        const response = await fetch('/api/chatbots/whatsapp/auth/qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'status',
            botId,
            sessionId,
            userId,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch session status')
        }

        const data = await response.json()
        const { session } = data

        // Update QR code if available
        if (session.qrCode && !qrCode) {
          setQrCode(session.qrCode)
        }

        // Check authentication status
        if (session.isConnected && session.status === 'authenticated') {
          setStatus('authenticated')
          setPhoneNumber(session.phoneNumber)
          clearInterval(interval)
          onAuthSuccess(session.phoneNumber)
          return
        }

        // Check for error
        if (session.status === 'failed' && session.error) {
          setError(session.error)
          setStatus('error')
          clearInterval(interval)
          onAuthFailed(session.error)
          return
        }
      } catch (err) {
        console.error('[v0] Error polling session status:', err)
      }

      // Stop polling after max attempts
      if (attempts >= maxAttempts) {
        setError('QR code expired. Please try again.')
        setStatus('error')
        clearInterval(interval)
        onAuthFailed('QR code expired')
      }
    }, 500)
  }, [botId, sessionId, userId, qrCode, onAuthSuccess, onAuthFailed])

  // Disconnect session
  const disconnectSession = useCallback(async () => {
    try {
      await fetch('/api/chatbots/whatsapp/auth/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'disconnect',
          botId,
          sessionId,
          userId,
        }),
      })

      setStatus('idle')
      setQrCode(null)
      setError(null)
      setPhoneNumber(null)
    } catch (err) {
      console.error('[v0] Error disconnecting session:', err)
    }
  }, [botId, sessionId, userId])

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>WhatsApp Authentication</CardTitle>
        <CardDescription>Scan QR code with your WhatsApp app</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status === 'authenticated' && phoneNumber && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Connected: {phoneNumber}
            </AlertDescription>
          </Alert>
        )}

        {/* QR Code Display */}
        {qrCode && status !== 'authenticated' && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <Image
                src={qrCode}
                alt="WhatsApp QR Code"
                width={300}
                height={300}
                priority
                className="w-full h-auto"
              />
            </div>

            <p className="text-sm text-gray-600 text-center">
              Open WhatsApp on your phone and scan this QR code
            </p>

            {status === 'waiting' && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Waiting for scan...
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="space-y-3 pt-4">
          {status === 'idle' || status === 'error' ? (
            <Button
              onClick={initiateQRAuth}
              disabled={status === 'initiating'}
              className="w-full"
              size="lg"
            >
              {status === 'initiating' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initiating...
                </>
              ) : (
                'Start Authentication'
              )}
            </Button>
          ) : status === 'authenticated' ? (
            <Button
              onClick={disconnectSession}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={disconnectSession}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              Cancel
            </Button>
          )}

          {/* Session ID for debugging */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Session ID:</p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-gray-700 flex-1 truncate">
                {sessionId}
              </code>
              <Button
                onClick={handleCopySessionId}
                variant="ghost"
                size="sm"
                className="h-auto p-1"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            {copied && <p className="text-xs text-green-600 mt-2">Copied!</p>}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <div className="flex items-center gap-2">
              {status === 'idle' && (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-gray-600">Ready</span>
                </>
              )}
              {status === 'initiating' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-blue-600">Initiating</span>
                </>
              )}
              {status === 'waiting' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-blue-600">Waiting</span>
                </>
              )}
              {status === 'authenticated' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Connected</span>
                </>
              )}
              {status === 'error' && (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Error</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
