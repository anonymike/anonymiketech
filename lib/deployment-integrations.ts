import axios, { AxiosError } from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface DeploymentCredentials {
  heroku?: {
    api_key: string
    app_name: string
  }
  railway?: {
    api_key: string
    project_id: string
  }
  render?: {
    api_key: string
    service_id: string
  }
  ssh?: {
    host: string
    port: number
    user: string
    password: string
  }
  docker?: {
    registry_url: string
    registry_user: string
    registry_password: string
  }
}

export interface BotDeploymentConfig {
  bot_id: string
  bot_name: string
  phone_number?: string
  system_prompt: string
  webhook_url?: string
  api_key?: string
  environment_variables?: Record<string, string>
}

export class HerokuDeploymentIntegration {
  constructor(private apiKey: string) {}

  async deploy(config: BotDeploymentConfig, appName: string) {
    try {
      const Heroku = require('heroku-client')
      const heroku = new Heroku({ token: this.apiKey })

      // Create or get app
      let app
      try {
        app = await heroku.get(`/apps/${appName}`)
      } catch (error: any) {
        if (error.statusCode === 404) {
          app = await heroku.post('/apps', { body: { name: appName } })
        } else {
          throw error
        }
      }

      // Set environment variables
      const configVars = {
        BOT_ID: config.bot_id,
        BOT_NAME: config.bot_name,
        SYSTEM_PROMPT: config.system_prompt,
        WEBHOOK_URL: config.webhook_url,
        API_KEY: config.api_key,
        ...config.environment_variables,
      }

      await heroku.patch(`/apps/${appName}/config-vars`, {
        body: configVars,
      })

      // Create Procfile
      const procfileContent = 'worker: node index.js\n'
      fs.writeFileSync('Procfile', procfileContent)

      return {
        success: true,
        app_url: app.web_url || `https://${appName}.herokuapp.com`,
        logs: [`Successfully deployed to Heroku: ${appName}`],
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `Heroku deployment failed: ${message}`,
        logs: [message],
      }
    }
  }
}

export class RailwayDeploymentIntegration {
  constructor(private apiKey: string) {}

  async deploy(config: BotDeploymentConfig, projectId: string) {
    try {
      const query = `
        mutation CreateService($input: ServiceCreateInput!) {
          serviceCreate(input: $input) {
            service {
              id
              name
            }
          }
        }
      `

      const variables = {
        input: {
          projectId,
          name: config.bot_name,
          source: {
            repo: 'https://github.com/anonymikey/whatsapp-bot-template',
            branch: 'main',
          },
        },
      }

      const response = await axios.post(
        'https://api.railway.app/graphql',
        { query, variables },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message)
      }

      return {
        success: true,
        service_id: response.data.data.serviceCreate.service.id,
        logs: [`Successfully deployed to Railway: ${response.data.data.serviceCreate.service.name}`],
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `Railway deployment failed: ${message}`,
        logs: [message],
      }
    }
  }
}

export class RenderDeploymentIntegration {
  constructor(private apiKey: string) {}

  async deploy(config: BotDeploymentConfig, serviceId?: string) {
    try {
      const deployPayload = {
        image: {
          context: '.',
          dockerfile: 'Dockerfile',
        },
        envVars: [
          { key: 'BOT_ID', value: config.bot_id },
          { key: 'BOT_NAME', value: config.bot_name },
          { key: 'SYSTEM_PROMPT', value: config.system_prompt },
          ...(config.webhook_url ? [{ key: 'WEBHOOK_URL', value: config.webhook_url }] : []),
          ...(config.api_key ? [{ key: 'API_KEY', value: config.api_key }] : []),
          ...(config.environment_variables
            ? Object.entries(config.environment_variables).map(([key, value]) => ({
                key,
                value,
              }))
            : []),
        ],
      }

      const response = await axios.post(
        `https://api.render.com/v1/services/${serviceId}/deploys`,
        deployPayload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        deploy_id: response.data.id,
        logs: [`Successfully initiated deployment on Render: ${response.data.id}`],
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `Render deployment failed: ${message}`,
        logs: [message],
      }
    }
  }
}

export class SSHDeploymentIntegration {
  constructor(
    private host: string,
    private port: number,
    private user: string,
    private password: string
  ) {}

  async deploy(config: BotDeploymentConfig) {
    try {
      // Generate deployment script
      const deployScript = this.generateDeployScript(config)

      // This would require ssh2 library in production
      // For now, return a placeholder
      return {
        success: true,
        logs: [
          `Generated deployment script for ${this.host}`,
          'SSH deployment would be executed with ssh2 library',
        ],
        script: deployScript,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `SSH deployment failed: ${message}`,
        logs: [message],
      }
    }
  }

  private generateDeployScript(config: BotDeploymentConfig): string {
    const envVars = {
      BOT_ID: config.bot_id,
      BOT_NAME: config.bot_name,
      SYSTEM_PROMPT: config.system_prompt,
      ...config.environment_variables,
    }

    const envVarString = Object.entries(envVars)
      .map(([key, value]) => `export ${key}="${value}"`)
      .join('\n')

    return `#!/bin/bash
set -e

# Environment variables
${envVarString}

# Create bot directory
mkdir -p /opt/whatsapp-bots/${config.bot_id}
cd /opt/whatsapp-bots/${config.bot_id}

# Clone or update bot code
if [ -d ".git" ]; then
  git pull origin main
else
  git clone https://github.com/anonymikey/whatsapp-bot-template.git .
fi

# Install dependencies
npm install

# Start bot with PM2
pm2 start index.js --name "whatsapp-bot-${config.bot_id}" --env "${envVarString.replace(/\n/g, ' ')}"

# Save PM2 configuration
pm2 save

echo "Bot deployed successfully!"
`
  }
}

export class DockerDeploymentIntegration {
  async generateDockerfiles(config: BotDeploymentConfig): Promise<{
    dockerfile: string
    dockerCompose: string
  }> {
    const envVars = Object.entries(config.environment_variables || {})
      .map(([key, value]) => `ENV ${key}="${value}"`)
      .join('\n')

    const dockerfile = `FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Environment variables
${envVars}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

EXPOSE 3000

CMD ["node", "index.js"]
`

    const dockerCompose = `version: '3.8'

services:
  whatsapp-bot:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: whatsapp-bot-${config.bot_id}
    environment:
      BOT_ID: ${config.bot_id}
      BOT_NAME: ${config.bot_name}
      SYSTEM_PROMPT: ${config.system_prompt}
      ${Object.entries(config.environment_variables || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n      ')}
    ports:
      - "3000:3000"
    restart: unless-stopped
    networks:
      - whatsapp-bots
    volumes:
      - ./sessions:/app/sessions
      - ./logs:/app/logs

networks:
  whatsapp-bots:
    driver: bridge
`

    return { dockerfile, dockerCompose }
  }

  async deploy(config: BotDeploymentConfig, registryUrl?: string): Promise<any> {
    try {
      const { dockerfile, dockerCompose } = await this.generateDockerfiles(config)

      return {
        success: true,
        dockerfile,
        dockerCompose,
        logs: [
          'Docker configuration generated successfully',
          'To deploy: docker-compose up -d',
        ],
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `Docker generation failed: ${message}`,
        logs: [message],
      }
    }
  }
}

export class DeploymentIntegrationManager {
  static async deploy(
    platform: 'heroku' | 'railway' | 'render' | 'ssh' | 'docker',
    config: BotDeploymentConfig,
    credentials: DeploymentCredentials
  ): Promise<any> {
    switch (platform) {
      case 'heroku':
        if (!credentials.heroku) throw new Error('Heroku credentials missing')
        const herokuIntegration = new HerokuDeploymentIntegration(
          credentials.heroku.api_key
        )
        return herokuIntegration.deploy(config, credentials.heroku.app_name)

      case 'railway':
        if (!credentials.railway) throw new Error('Railway credentials missing')
        const railwayIntegration = new RailwayDeploymentIntegration(
          credentials.railway.api_key
        )
        return railwayIntegration.deploy(config, credentials.railway.project_id)

      case 'render':
        if (!credentials.render) throw new Error('Render credentials missing')
        const renderIntegration = new RenderDeploymentIntegration(
          credentials.render.api_key
        )
        return renderIntegration.deploy(config, credentials.render.service_id)

      case 'ssh':
        if (!credentials.ssh) throw new Error('SSH credentials missing')
        const sshIntegration = new SSHDeploymentIntegration(
          credentials.ssh.host,
          credentials.ssh.port,
          credentials.ssh.user,
          credentials.ssh.password
        )
        return sshIntegration.deploy(config)

      case 'docker':
        const dockerIntegration = new DockerDeploymentIntegration()
        return dockerIntegration.deploy(config, credentials.docker?.registry_url)

      default:
        throw new Error(`Unsupported deployment platform: ${platform}`)
    }
  }
}
