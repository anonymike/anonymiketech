'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Loader2, Rocket, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface DeploymentConfig {
  method: 'direct_server' | 'heroku' | 'railway' | 'render' | 'docker'
  dockerImage?: string
  herokuAppName?: string
  herokuApiKey?: string
  railwayProjectId?: string
  railwayToken?: string
  renderServiceId?: string
  renderApiKey?: string
  serverHost?: string
  serverPort?: number
  serverAuthKey?: string
}

interface EnvVars {
  [key: string]: string
}

interface Props {
  botId: string
  token?: string
  botStatus?: string
  onDeployed?: () => void
}

const DEFAULT_ENV_VARS: EnvVars = {
  NODE_ENV: 'production',
  DEBUG: 'false',
  LOG_LEVEL: 'info',
  WEBHOOK_URL: 'https://your-domain.com/webhook',
  BAILEYS_TIMEOUT: '30000',
}

export default function WhatsAppBotDeploymentPanel({
  botId,
  token,
  botStatus,
  onDeployed,
}: Props) {
  const [method, setMethod] = useState<DeploymentConfig['method']>('direct_server')
  const [envVars, setEnvVars] = useState<EnvVars>(DEFAULT_ENV_VARS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [deployed, setDeployed] = useState(botStatus === 'deployed')
  const [newEnvKey, setNewEnvKey] = useState('')
  const [newEnvValue, setNewEnvValue] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const [deploymentConfig, setDeploymentConfig] = useState<Partial<DeploymentConfig>>({
    method: 'direct_server',
  })

  const handleDeploy = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const response = await fetch(
        `/api/chatbots/whatsapp/bots/${botId}/deploy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            method,
            environmentVariables: envVars,
            ...deploymentConfig,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Deployment failed')
      }

      setSuccess(true)
      setDeployed(true)
      setTimeout(() => setSuccess(false), 3000)
      onDeployed?.()
    } catch (err) {
      console.error('[v0] Error deploying bot:', err)
      setError(err instanceof Error ? err.message : 'Deployment failed')
    } finally {
      setLoading(false)
    }
  }

  const addEnvVar = () => {
    if (newEnvKey.trim() && newEnvValue.trim()) {
      setEnvVars({
        ...envVars,
        [newEnvKey]: newEnvValue,
      })
      setNewEnvKey('')
      setNewEnvValue('')
    }
  }

  const removeEnvVar = (key: string) => {
    const { [key]: _, ...rest } = envVars
    setEnvVars(rest)
  }

  const copyEnvVar = (key: string) => {
    navigator.clipboard.writeText(`${key}=${envVars[key]}`)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Deploy Your Bot</h3>
        <p className="text-sm text-muted-foreground">
          Choose your deployment method and configure environment variables
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-50 dark:bg-green-950 p-4">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✓ Bot deployed successfully!
          </p>
        </div>
      )}

      {deployed && (
        <div className="rounded-lg border border-blue-500/50 bg-blue-50 dark:bg-blue-950 p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ✓ Your bot is deployed and running
          </p>
        </div>
      )}

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>Deployment Method</Label>
          <Select value={method} onValueChange={(value: any) => setMethod(value)}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct_server">
                <div className="flex items-center gap-2">
                  <span>Direct Server</span>
                  <span className="text-xs text-muted-foreground">(VPS/Dedicated)</span>
                </div>
              </SelectItem>
              <SelectItem value="heroku">Heroku</SelectItem>
              <SelectItem value="railway">Railway</SelectItem>
              <SelectItem value="render">Render</SelectItem>
              <SelectItem value="docker">Docker Container</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose the platform where your bot will run
          </p>
        </div>

        {/* Platform-specific configuration */}
        {method === 'direct_server' && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">Server Configuration</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Server Host</Label>
                <Input
                  placeholder="example.com or 192.168.1.1"
                  value={deploymentConfig.serverHost || ''}
                  onChange={(e) =>
                    setDeploymentConfig({
                      ...deploymentConfig,
                      serverHost: e.target.value,
                    })
                  }
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input
                  placeholder="3000"
                  type="number"
                  value={deploymentConfig.serverPort || ''}
                  onChange={(e) =>
                    setDeploymentConfig({
                      ...deploymentConfig,
                      serverPort: parseInt(e.target.value),
                    })
                  }
                  className="bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Server Auth Key</Label>
              <Input
                type="password"
                placeholder="Your server authentication key"
                value={deploymentConfig.serverAuthKey || ''}
                onChange={(e) =>
                  setDeploymentConfig({
                    ...deploymentConfig,
                    serverAuthKey: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>
          </div>
        )}

        {method === 'heroku' && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">Heroku Configuration</h4>
            <div className="space-y-2">
              <Label>Heroku App Name</Label>
              <Input
                placeholder="your-app-name"
                value={deploymentConfig.herokuAppName || ''}
                onChange={(e) =>
                  setDeploymentConfig({
                    ...deploymentConfig,
                    herokuAppName: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Heroku API Key</Label>
              <Input
                type="password"
                placeholder="Your Heroku API key"
                value={deploymentConfig.herokuApiKey || ''}
                onChange={(e) =>
                  setDeploymentConfig({
                    ...deploymentConfig,
                    herokuApiKey: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>
          </div>
        )}

        {method === 'docker' && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">Docker Configuration</h4>
            <div className="space-y-2">
              <Label>Docker Image</Label>
              <Input
                placeholder="docker-registry/your-bot-image:latest"
                value={deploymentConfig.dockerImage || ''}
                onChange={(e) =>
                  setDeploymentConfig({
                    ...deploymentConfig,
                    dockerImage: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Environment Variables</h4>
          <p className="text-sm text-muted-foreground">
            Add environment variables your bot needs to run
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <Input
              placeholder="Variable name (e.g., BOT_TOKEN)"
              value={newEnvKey}
              onChange={(e) => setNewEnvKey(e.target.value)}
              className="bg-background"
            />
            <Input
              placeholder="Variable value"
              value={newEnvValue}
              onChange={(e) => setNewEnvValue(e.target.value)}
              type="password"
              className="bg-background"
            />
            <Button
              onClick={addEnvVar}
              variant="outline"
              className="w-full"
              disabled={!newEnvKey.trim()}
            >
              Add Variable
            </Button>
          </div>
        </div>

        {Object.entries(envVars).length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Variables</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(envVars).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-muted p-3 rounded-lg text-sm"
                >
                  <div className="font-mono space-y-0.5">
                    <p className="font-semibold">{key}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {value.substring(0, 30)}
                      {value.length > 30 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyEnvVar(key)}
                      variant="ghost"
                      size="sm"
                    >
                      {copiedKey === key ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => removeEnvVar(key)}
                      variant="ghost"
                      size="sm"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Button
        onClick={handleDeploy}
        disabled={loading || deployed}
        className="w-full h-11"
        size="lg"
      >
        {deployed ? (
          <>✓ Deployed</>
        ) : loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deploying...
          </>
        ) : (
          <>
            <Rocket className="mr-2 h-4 w-4" />
            Deploy Bot
          </>
        )}
      </Button>

      {deployed && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              Deployment Instructions
            </p>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200 text-xs list-disc list-inside">
              <li>Your bot is configured and ready to use</li>
              <li>Use the provided credentials to connect your Baileys client</li>
              <li>Monitor bot activity in the dashboard</li>
              <li>Check logs for any issues during operation</li>
            </ul>
          </div>
        </Card>
      )}
    </motion.div>
  )
}
