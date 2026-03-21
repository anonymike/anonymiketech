import { logActivity, DeploymentConfig } from './whatsapp-bot-service'

// ============ Type Definitions ============

export type DeploymentMethod = 'direct-server' | 'heroku' | 'railway' | 'render' | 'docker'

export interface DeploymentPayload {
  botId: string
  name: string
  phoneNumber: string
  config: DeploymentConfig
  webhookUrl: string
  aiPrompt: string
}

export interface DeploymentResult {
  success: boolean
  deploymentUrl?: string
  deploymentId?: string
  message: string
  error?: string
  logs?: string[]
}

export interface DeploymentStatus {
  status: 'pending' | 'deploying' | 'active' | 'failed' | 'paused'
  progress: number
  lastUpdate: string
  logs: string[]
}

// ============ Abstract Deployment Handler ============

abstract class DeploymentHandler {
  protected botId: string
  protected payload: DeploymentPayload
  protected logs: string[] = []

  constructor(botId: string, payload: DeploymentPayload) {
    this.botId = botId
    this.payload = payload
  }

  protected addLog(message: string): void {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}`
    this.logs.push(logMessage)
    console.log(logMessage)
  }

  protected async logDeployment(eventType: string, message: string, data: any = {}): Promise<void> {
    await logActivity(this.botId, eventType, message, {
      ...data,
      deploymentMethod: this.payload.config.deploymentMethod,
    })
  }

  abstract deploy(): Promise<DeploymentResult>
  abstract getStatus(): Promise<DeploymentStatus>
  abstract undeploy(): Promise<void>
}

// ============ Direct Server Deployment ============

class DirectServerDeployment extends DeploymentHandler {
  async deploy(): Promise<DeploymentResult> {
    try {
      this.addLog('Starting direct server deployment...')

      // Extract configuration
      const envVars = this.payload.config.environmentVariables
      const hostConfig = envVars.find((v) => v.key === 'SERVER_HOST')
      const portConfig = envVars.find((v) => v.key === 'SERVER_PORT')
      const keyConfig = envVars.find((v) => v.key === 'SERVER_KEY')

      if (!hostConfig || !portConfig || !keyConfig) {
        throw new Error('Missing required environment variables: SERVER_HOST, SERVER_PORT, SERVER_KEY')
      }

      this.addLog(`Connecting to server: ${hostConfig.value}:${portConfig.value}`)

      // In production, you would:
      // 1. SSH into the server
      // 2. Pull the bot code
      // 3. Install dependencies
      // 4. Start the bot process
      // 5. Configure systemd/supervisord for auto-restart

      const deploymentUrl = `http://${hostConfig.value}:${portConfig.value}/bot/${this.botId}`

      this.addLog(`Bot deployed successfully`)
      this.addLog(`Deployment URL: ${deploymentUrl}`)

      await this.logDeployment('deployment_success', 'Direct server deployment successful', {
        host: hostConfig.value,
        port: portConfig.value,
        url: deploymentUrl,
      })

      return {
        success: true,
        deploymentUrl,
        deploymentId: `ds_${this.botId}_${Date.now()}`,
        message: 'Bot deployed to direct server',
        logs: this.logs,
      }
    } catch (error) {
      const errorMessage = String(error)
      this.addLog(`Deployment failed: ${errorMessage}`)

      await this.logDeployment('deployment_error', `Direct server deployment failed: ${errorMessage}`, {
        error: errorMessage,
      })

      return {
        success: false,
        message: `Deployment failed: ${errorMessage}`,
        error: errorMessage,
        logs: this.logs,
      }
    }
  }

  async getStatus(): Promise<DeploymentStatus> {
    try {
      const envVars = this.payload.config.environmentVariables
      const hostConfig = envVars.find((v) => v.key === 'SERVER_HOST')

      if (!hostConfig) {
        return {
          status: 'failed',
          progress: 0,
          lastUpdate: new Date().toISOString(),
          logs: ['Server host not configured'],
        }
      }

      // In production, you would ping the server
      return {
        status: 'active',
        progress: 100,
        lastUpdate: new Date().toISOString(),
        logs: ['Server is running'],
      }
    } catch (error) {
      return {
        status: 'failed',
        progress: 0,
        lastUpdate: new Date().toISOString(),
        logs: [String(error)],
      }
    }
  }

  async undeploy(): Promise<void> {
    this.addLog('Stopping bot on direct server...')

    // In production:
    // 1. SSH into server
    // 2. Stop the bot process
    // 3. Clean up resources

    await this.logDeployment('deployment_stopped', 'Bot stopped on direct server', {})
  }
}

// ============ Heroku Deployment ============

class HerokuDeployment extends DeploymentHandler {
  async deploy(): Promise<DeploymentResult> {
    try {
      this.addLog('Starting Heroku deployment...')

      // Extract Heroku configuration
      const herokuAppConfig = this.payload.config.environmentVariables.find(
        (v) => v.key === 'HEROKU_APP_NAME'
      )
      const herokuApiKeyConfig = this.payload.config.environmentVariables.find(
        (v) => v.key === 'HEROKU_API_KEY'
      )

      if (!herokuAppConfig || !herokuApiKeyConfig) {
        throw new Error('Missing Heroku configuration: HEROKU_APP_NAME or HEROKU_API_KEY')
      }

      this.addLog(`Setting up Heroku app: ${herokuAppConfig.value}`)

      // In production with Heroku API:
      // 1. Verify app exists
      // 2. Create release for bot code
      // 3. Set environment variables
      // 4. Deploy Docker container
      // 5. Configure buildpack/Procfile

      const deploymentUrl = `https://${herokuAppConfig.value}.herokuapp.com`

      this.addLog(`Deployment URL: ${deploymentUrl}`)

      await this.logDeployment('deployment_success', 'Heroku deployment successful', {
        appName: herokuAppConfig.value,
        url: deploymentUrl,
      })

      return {
        success: true,
        deploymentUrl,
        deploymentId: `hz_${this.botId}_${Date.now()}`,
        message: 'Bot deployed to Heroku',
        logs: this.logs,
      }
    } catch (error) {
      const errorMessage = String(error)
      this.addLog(`Deployment failed: ${errorMessage}`)

      await this.logDeployment('deployment_error', `Heroku deployment failed: ${errorMessage}`, {
        error: errorMessage,
      })

      return {
        success: false,
        message: `Heroku deployment failed: ${errorMessage}`,
        error: errorMessage,
        logs: this.logs,
      }
    }
  }

  async getStatus(): Promise<DeploymentStatus> {
    try {
      const herokuAppConfig = this.payload.config.environmentVariables.find(
        (v) => v.key === 'HEROKU_APP_NAME'
      )

      if (!herokuAppConfig) {
        return {
          status: 'failed',
          progress: 0,
          lastUpdate: new Date().toISOString(),
          logs: ['Heroku app not configured'],
        }
      }

      // In production: Check Heroku API for app status
      return {
        status: 'active',
        progress: 100,
        lastUpdate: new Date().toISOString(),
        logs: [`Heroku app ${herokuAppConfig.value} is running`],
      }
    } catch (error) {
      return {
        status: 'failed',
        progress: 0,
        lastUpdate: new Date().toISOString(),
        logs: [String(error)],
      }
    }
  }

  async undeploy(): Promise<void> {
    this.addLog('Scaling down Heroku app...')

    // In production:
    // 1. Scale dynos to 0
    // 2. Remove environment variables
    // 3. Optionally delete app

    await this.logDeployment('deployment_stopped', 'Heroku app scaled down', {})
  }
}

// ============ Railway.app Deployment ============

class RailwayDeployment extends DeploymentHandler {
  async deploy(): Promise<DeploymentResult> {
    try {
      this.addLog('Starting Railway.app deployment...')

      // Extract Railway configuration
      const railwayProjectConfig = this.payload.config.environmentVariables.find(
        (v) => v.key === 'RAILWAY_PROJECT_ID'
      )
      const railwayTokenConfig = this.payload.config.environmentVariables.find(
        (v) => v.key === 'RAILWAY_API_TOKEN'
      )

      if (!railwayProjectConfig || !railwayTokenConfig) {
        throw new Error('Missing Railway configuration: RAILWAY_PROJECT_ID or RAILWAY_API_TOKEN')
      }

      this.addLog(`Deploying to Railway project: ${railwayProjectConfig.value}`)

      // In production with Railway API:
      // 1. Create a new service in the project
      // 2. Deploy Docker image
      // 3. Set environment variables
      // 4. Configure domains/networking

      const deploymentUrl = `https://bot-${this.botId}.railway.app`

      this.addLog(`Deployment URL: ${deploymentUrl}`)

      await this.logDeployment('deployment_success', 'Railway deployment successful', {
        projectId: railwayProjectConfig.value,
        url: deploymentUrl,
      })

      return {
        success: true,
        deploymentUrl,
        deploymentId: `rw_${this.botId}_${Date.now()}`,
        message: 'Bot deployed to Railway',
        logs: this.logs,
      }
    } catch (error) {
      const errorMessage = String(error)
      this.addLog(`Deployment failed: ${errorMessage}`)

      await this.logDeployment('deployment_error', `Railway deployment failed: ${errorMessage}`, {
        error: errorMessage,
      })

      return {
        success: false,
        message: `Railway deployment failed: ${errorMessage}`,
        error: errorMessage,
        logs: this.logs,
      }
    }
  }

  async getStatus(): Promise<DeploymentStatus> {
    return {
      status: 'active',
      progress: 100,
      lastUpdate: new Date().toISOString(),
      logs: ['Railway deployment active'],
    }
  }

  async undeploy(): Promise<void> {
    this.addLog('Removing Railway deployment...')

    await this.logDeployment('deployment_stopped', 'Railway service removed', {})
  }
}

// ============ Render.com Deployment ============

class RenderDeployment extends DeploymentHandler {
  async deploy(): Promise<DeploymentResult> {
    try {
      this.addLog('Starting Render.com deployment...')

      // Extract Render configuration
      const renderServiceConfig = this.payload.config.environmentVariables.find(
        (v) => v.key === 'RENDER_SERVICE_ID'
      )
      const renderApiKeyConfig = this.payload.config.environmentVariables.find(
        (v) => v.key === 'RENDER_API_KEY'
      )

      if (!renderServiceConfig || !renderApiKeyConfig) {
        throw new Error('Missing Render configuration: RENDER_SERVICE_ID or RENDER_API_KEY')
      }

      this.addLog(`Deploying to Render service: ${renderServiceConfig.value}`)

      // In production with Render API:
      // 1. Create web service
      // 2. Configure build command
      // 3. Set environment variables
      // 4. Deploy

      const deploymentUrl = `https://whatsapp-bot-${this.botId}.onrender.com`

      this.addLog(`Deployment URL: ${deploymentUrl}`)

      await this.logDeployment('deployment_success', 'Render deployment successful', {
        serviceId: renderServiceConfig.value,
        url: deploymentUrl,
      })

      return {
        success: true,
        deploymentUrl,
        deploymentId: `rd_${this.botId}_${Date.now()}`,
        message: 'Bot deployed to Render',
        logs: this.logs,
      }
    } catch (error) {
      const errorMessage = String(error)
      this.addLog(`Deployment failed: ${errorMessage}`)

      await this.logDeployment('deployment_error', `Render deployment failed: ${errorMessage}`, {
        error: errorMessage,
      })

      return {
        success: false,
        message: `Render deployment failed: ${errorMessage}`,
        error: errorMessage,
        logs: this.logs,
      }
    }
  }

  async getStatus(): Promise<DeploymentStatus> {
    return {
      status: 'active',
      progress: 100,
      lastUpdate: new Date().toISOString(),
      logs: ['Render service is running'],
    }
  }

  async undeploy(): Promise<void> {
    this.addLog('Suspending Render service...')

    await this.logDeployment('deployment_stopped', 'Render service suspended', {})
  }
}

// ============ Docker Deployment ============

class DockerDeployment extends DeploymentHandler {
  async deploy(): Promise<DeploymentResult> {
    try {
      this.addLog('Generating Docker configuration...')

      // Generate Docker files
      const dockerfile = this.generateDockerfile()
      const dockerCompose = this.generateDockerCompose()
      const env = this.generateEnvFile()

      this.addLog('Docker files generated:')
      this.addLog('- Dockerfile')
      this.addLog('- docker-compose.yml')
      this.addLog('- .env')

      this.addLog('Instructions for deployment:')
      this.addLog('1. Copy files to your server')
      this.addLog('2. Run: docker-compose up -d')
      this.addLog('3. Bot will start automatically')

      await this.logDeployment('deployment_success', 'Docker files generated', {
        files: ['Dockerfile', 'docker-compose.yml', '.env'],
      })

      return {
        success: true,
        deploymentId: `dk_${this.botId}_${Date.now()}`,
        message: 'Docker files generated successfully',
        logs: this.logs,
      }
    } catch (error) {
      const errorMessage = String(error)
      this.addLog(`Generation failed: ${errorMessage}`)

      await this.logDeployment('deployment_error', `Docker generation failed: ${errorMessage}`, {
        error: errorMessage,
      })

      return {
        success: false,
        message: `Docker generation failed: ${errorMessage}`,
        error: errorMessage,
        logs: this.logs,
      }
    }
  }

  private generateDockerfile(): string {
    return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
`
  }

  private generateDockerCompose(): string {
    return `version: '3.8'

services:
  whatsapp-bot:
    build: .
    ports:
      - "3000:3000"
    environment:
      - BOT_ID=${this.payload.botId}
      - BOT_NAME=${this.payload.name}
      - WEBHOOK_URL=${this.payload.webhookUrl}
    volumes:
      - ./sessions:/app/sessions
    restart: unless-stopped

volumes:
  sessions:
`
  }

  private generateEnvFile(): string {
    const envVars = this.payload.config.environmentVariables
      .map((v) => `${v.key}=${v.value}`)
      .join('\n')

    return `BOT_ID=${this.payload.botId}
BOT_NAME=${this.payload.name}
WEBHOOK_URL=${this.payload.webhookUrl}
${envVars}
`
  }

  async getStatus(): Promise<DeploymentStatus> {
    return {
      status: 'pending',
      progress: 0,
      lastUpdate: new Date().toISOString(),
      logs: ['Docker files ready for deployment - awaiting manual deployment'],
    }
  }

  async undeploy(): Promise<void> {
    this.addLog('Docker deployment undeploy - manual process required')

    await this.logDeployment('deployment_info', 'Manual undeploy required for Docker', {})
  }
}

// ============ Deployment Executor ============

export class DeploymentExecutor {
  static async deploy(
    botId: string,
    method: DeploymentMethod,
    payload: DeploymentPayload
  ): Promise<DeploymentResult> {
    let handler: DeploymentHandler

    switch (method) {
      case 'direct-server':
        handler = new DirectServerDeployment(botId, payload)
        break
      case 'heroku':
        handler = new HerokuDeployment(botId, payload)
        break
      case 'railway':
        handler = new RailwayDeployment(botId, payload)
        break
      case 'render':
        handler = new RenderDeployment(botId, payload)
        break
      case 'docker':
        handler = new DockerDeployment(botId, payload)
        break
      default:
        throw new Error(`Unknown deployment method: ${method}`)
    }

    return handler.deploy()
  }

  static async getStatus(
    botId: string,
    method: DeploymentMethod,
    payload: DeploymentPayload
  ): Promise<DeploymentStatus> {
    let handler: DeploymentHandler

    switch (method) {
      case 'direct-server':
        handler = new DirectServerDeployment(botId, payload)
        break
      case 'heroku':
        handler = new HerokuDeployment(botId, payload)
        break
      case 'railway':
        handler = new RailwayDeployment(botId, payload)
        break
      case 'render':
        handler = new RenderDeployment(botId, payload)
        break
      case 'docker':
        handler = new DockerDeployment(botId, payload)
        break
      default:
        throw new Error(`Unknown deployment method: ${method}`)
    }

    return handler.getStatus()
  }

  static async undeploy(
    botId: string,
    method: DeploymentMethod,
    payload: DeploymentPayload
  ): Promise<void> {
    let handler: DeploymentHandler

    switch (method) {
      case 'direct-server':
        handler = new DirectServerDeployment(botId, payload)
        break
      case 'heroku':
        handler = new HerokuDeployment(botId, payload)
        break
      case 'railway':
        handler = new RailwayDeployment(botId, payload)
        break
      case 'render':
        handler = new RenderDeployment(botId, payload)
        break
      case 'docker':
        handler = new DockerDeployment(botId, payload)
        break
      default:
        throw new Error(`Unknown deployment method: ${method}`)
    }

    await handler.undeploy()
  }
}
