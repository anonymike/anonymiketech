import { NextRequest, NextResponse } from 'next/server'
import { botRunnerManager } from '@/lib/bot-runner'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const botId = searchParams.get('botId')
    const userId = searchParams.get('userId')

    if (!botId || !userId) {
      return NextResponse.json(
        { error: 'Missing required query params: botId, userId' },
        { status: 400 }
      )
    }

    // Verify user owns the bot (in production, verify via database)
    const status = botRunnerManager.getInstanceStatus(botId)
    if (status && status.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const metrics = botRunnerManager.getMetrics(botId)
    if (!metrics) {
      return NextResponse.json(
        { error: 'Metrics not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      metrics: {
        botId: metrics.botId,
        uptime: metrics.uptime,
        messagesProcessed: metrics.messagesProcessed,
        errorCount: metrics.errorCount,
        lastMessage: metrics.lastMessage,
        cpuUsage: metrics.cpuUsage,
        memoryUsage: metrics.memoryUsage,
      },
    })
  } catch (error) {
    console.error('[v0] Metrics API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { botId, userId, metrics: metricsUpdate } = await request.json()

    if (!botId || !userId || !metricsUpdate) {
      return NextResponse.json(
        { error: 'Missing required fields: botId, userId, metrics' },
        { status: 400 }
      )
    }

    // Verify user owns the bot
    const status = botRunnerManager.getInstanceStatus(botId)
    if (status && status.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    botRunnerManager.updateMetrics(botId, metricsUpdate)

    const updated = botRunnerManager.getMetrics(botId)
    return NextResponse.json({
      success: true,
      metrics: updated,
    })
  } catch (error) {
    console.error('[v0] Metrics update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
