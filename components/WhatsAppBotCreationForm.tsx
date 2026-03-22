'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Template {
  id: string
  name: string
  icon: string
}

interface Props {
  template: Template
  onSuccess: (botId: string) => void
  onBack: () => void
  token?: string
}

export default function WhatsAppBotCreationForm({
  template,
  onSuccess,
  onBack,
  token,
}: Props) {
  const [botName, setBotName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [deploymentMethod, setDeploymentMethod] =
    useState<'direct_server'>('direct_server')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!botName.trim() || !phoneNumber.trim()) {
      setError('Please fill in all required fields')
      return
    }

    // Basic phone number validation (contains at least numbers)
    if (!/\d{10,}/.test(phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/chatbots/whatsapp/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template_id: template.id,
          bot_name: botName.trim(),
          phone_number: phoneNumber.trim(),
          deployment_method: deploymentMethod,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create bot')
      }

      const data = await response.json()
      onSuccess(data.data.id)
    } catch (err) {
      console.error('[v0] Error creating bot:', err)
      setError(err instanceof Error ? err.message : 'Failed to create bot')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </button>
          <div>
            <h3 className="text-lg font-semibold">Create WhatsApp Bot</h3>
            <p className="text-sm text-muted-foreground">
              {template.name} {template.icon}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="botName">Bot Name *</Label>
          <Input
            id="botName"
            placeholder="e.g., My Customer Support Bot"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            disabled={loading}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">
            Give your bot a descriptive name
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">WhatsApp Phone Number *</Label>
          <Input
            id="phoneNumber"
            placeholder="+1234567890 or 1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
            className="bg-background"
            type="tel"
          />
          <p className="text-xs text-muted-foreground">
            Your WhatsApp Business Account phone number (with country code)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deployment">Deployment Method *</Label>
          <Select value={deploymentMethod} onValueChange={setDeploymentMethod}>
            <SelectTrigger disabled={loading} className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct_server">Direct Server</SelectItem>
              <SelectItem value="heroku">Heroku</SelectItem>
              <SelectItem value="railway">Railway</SelectItem>
              <SelectItem value="render">Render</SelectItem>
              <SelectItem value="docker">Docker Container</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose where you want to deploy your bot
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Bot'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
