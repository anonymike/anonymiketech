import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  getWhatsappBot,
  updateWhatsappBotStatus,
  createWhatsappDeploymentConfig,
  getWhatsappDeploymentConfig,
  updateWhatsappDeploymentConfig,
  logWhatsappBotActivity,
  updateWhatsappBotEnvironmentVariables,
} from '@/lib/whatsapp-bot-service'
import { getChatbotUserByAuthId } from '@/lib/supabase-chatbots-service'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await getChatbotUserByAuthId(data.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify bot ownership
    const bot = await getWhatsappBot(params.id)
    if (!bot || bot.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Bot not found or not owned by user' },
        { status: 404 }
      )
    }

    const {
      method,
      environmentVariables,
      dockerImage,
      herokuAppName,
      railwayProjectId,
      renderServiceId,
      serverHost,
      serverPort,
    } = await request.json()

    if (!method) {
      return NextResponse.json(
        { error: 'Deployment method is required' },
        { status: 400 }
      )
    }

    // Update bot status
    await updateWhatsappBotStatus(params.id, 'configuring')

    // Store environment variables
    if (environmentVariables) {
      await updateWhatsappBotEnvironmentVariables(params.id, environmentVariables)
    }

    // Check if deployment config exists
    let deploymentConfig = await getWhatsappDeploymentConfig(params.id)

    const configData = {
      method,
      docker_image: dockerImage,
      heroku_app_name: herokuAppName,
      railway_project_id: railwayProjectId,
      render_service_id: renderServiceId,
      server_host: serverHost,
      server_port: serverPort,
    }

    if (deploymentConfig) {
      await updateWhatsappDeploymentConfig(params.id, configData)
    } else {
      deploymentConfig = await createWhatsappDeploymentConfig(
        params.id,
        configData
      )
    }

    // Log deployment activity
    await logWhatsappBotActivity(
      params.id,
      'info',
      `Deployment configured for method: ${method}`,
      { method, timestamp: new Date().toISOString() }
    )

    // Simulate deployment (in production, this would trigger actual deployment)
    try {
      // Set status to deployed
      await updateWhatsappBotStatus(params.id, 'deployed')

      return NextResponse.json({
        success: true,
        data: {
          bot: bot,
          deployment: deploymentConfig,
        },
        message: `WhatsApp bot deployment configured successfully. The bot is ready to be deployed using ${method}.`,
      })
    } catch (deploymentError) {
      await updateWhatsappBotStatus(
        params.id,
        'error',
        `Deployment failed: ${deploymentError instanceof Error ? deploymentError.message : 'Unknown error'}`
      )

      await logWhatsappBotActivity(
        params.id,
        'error',
        `Deployment failed: ${deploymentError instanceof Error ? deploymentError.message : 'Unknown error'}`,
        { error: deploymentError, timestamp: new Date().toISOString() }
      )

      return NextResponse.json(
        {
          error: 'Deployment failed',
          details: deploymentError instanceof Error ? deploymentError.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[v0] Error deploying WhatsApp bot:', error)

    if (params.id) {
      await updateWhatsappBotStatus(
        params.id,
        'error',
        `Deployment error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }

    return NextResponse.json(
      { error: 'Failed to deploy WhatsApp bot' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await getChatbotUserByAuthId(data.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify bot ownership
    const bot = await getWhatsappBot(params.id)
    if (!bot || bot.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Bot not found or not owned by user' },
        { status: 404 }
      )
    }

    // Get deployment config
    const deploymentConfig = await getWhatsappDeploymentConfig(params.id)

    return NextResponse.json({
      success: true,
      data: {
        bot: bot,
        deployment: deploymentConfig,
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching deployment config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deployment config' },
      { status: 500 }
    )
  }
}
