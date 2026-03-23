'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2, CheckCircle, Copy, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface TruthMdSessionImporterProps {
  botId: string
  token?: string
  onSessionImported?: (sessionData: any) => void
  onDeployed?: () => void
}

export default function TruthMdSessionImporter({
  botId,
  token,
  onSessionImported,
  onDeployed,
}: TruthMdSessionImporterProps) {
  const [sessionString, setSessionString] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [deployLoading, setDeployLoading] = useState(false)

  const validateSessionFormat = (session: string): boolean => {
    // Validate TRUTH-MD format: should start with "TRUTH-MD:~" and contain JSON
    return session.trim().startsWith('TRUTH-MD:~') && session.length > 20
  }

  const handleImportSession = async (e: React.FormEvent) => {
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

      // Save session to bot
      const response = await fetch(
        `/api/chatbots/whatsapp/bots/${botId}/session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            session_string: sessionString.trim(),
            source: 'truth_md',
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to import session')
      }

      const data = await response.json()
      setSuccess(true)
      setSessionString('')

      if (onSessionImported) {
        onSessionImported(data.data)
      }

      // Auto-deploy after 1 second
      setTimeout(() => {
        handleAutoDeploy()
      }, 1000)
    } catch (err) {
      console.error('[v0] Error importing session:', err)
      setError(err instanceof Error ? err.message : 'Failed to import session')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoDeploy = async () => {
    try {
      setDeployLoading(true)

      const response = await fetch(
        `/api/chatbots/whatsapp/bots/${botId}/deploy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deployment_method: 'direct_server',
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        console.error('[v0] Deployment warning:', data.error)
      }

      if (onDeployed) {
        onDeployed()
      }
    } catch (err) {
      console.error('[v0] Auto-deployment attempted:', err)
      // Don't fail if deployment has an issue - session was imported
    } finally {
      setDeployLoading(false)
    }
  }

  if (success && !deployLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Session Imported Successfully!
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                Your TRUTH MD session has been saved and your bot is being deployed now.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300">
                  Deploying bot... This may take a few moments.
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Import TRUTH MD Session
        </h3>
        <p className="text-sm text-muted-foreground">
          Paste your TRUTH MD session to automatically deploy your bot
        </p>
      </div>

      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              How to get your TRUTH MD session:
            </p>
            <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-decimal">
              <li>Go to https://truth-md.courtneytech.xyz/</li>
              <li>Follow the WhatsApp pairing process</li>
              <li>Once paired, copy the session string starting with TRUTH-MD:~</li>
              <li>Paste it below</li>
            </ol>
          </div>
        </div>
      </Card>

      <form onSubmit={handleImportSession} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="session">TRUTH MD Session *</Label>
          <Textarea
            id="session"
            value={sessionString}
            onChange={(e) => setSessionString(e.target.value)}
            placeholder="Paste your TRUTH-MD:~ session here..."
            disabled={loading || deployLoading}
            className="min-h-32 font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Paste the entire session string. It should start with TRUTH-MD:~
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Invalid Session
              </p>
              <p className="text-xs text-red-800 dark:text-red-200 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading || deployLoading || !sessionString.trim()}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : deployLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Import & Deploy
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowExample(!showExample)}
            disabled={loading || deployLoading}
          >
            {showExample ? 'Hide' : 'Show'} Example
          </Button>
        </div>
      </form>

      {showExample && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted rounded-lg border border-muted-foreground/20"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground mb-2">
              Example Format:
            </p>
            <div className="bg-background p-3 rounded border border-muted-foreground/10 overflow-x-auto">
              <code className="text-xs text-muted-foreground break-all">
                TRUTH-MD:~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbNTYsMTAxLDEwNyw2NiwxNzAsNDYsMTgxLDE1MSwxMjgsMjExLDE5NSwxODYsMjQ3LDc4LDE3NywxMzksM...
              </code>
            </div>
            <p className="text-xs text-muted-foreground">
              Your session will be much longer than this example
            </p>
          </div>
        </motion.div>
      )}

      <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-1">
              Secure & Private
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Your session is encrypted and stored securely. It's never shared with third parties.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
