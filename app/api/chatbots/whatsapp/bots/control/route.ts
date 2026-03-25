import { NextRequest, NextResponse } from 'next/server'
import { botRunnerManager } from '@/lib/bot-runner'

export async function POST(request: NextRequest) {
  try {
    const { action, botId, userId } = await request.json()

    if (!action || !botId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: action, botId, userId' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'start':
        await botRunnerManager.startBot(botId, userId)
        return NextResponse.json({
          success: true,
          message: 'Bot started successfully',
          status: 'running',
        })

      case 'stop':
        await botRunnerManager.stopBot(botId, userId)
        return NextResponse.json({
          success: true,
          message: 'Bot stopped successfully',
          status: 'stopped',
        })

      case 'pause':
        await botRunnerManager.pauseBot(botId, userId)
        return NextResponse.json({
          success: true,
          message: 'Bot paused successfully',
          status: 'paused',
        })

      case 'resume':
        await botRunnerManager.resumeBot(botId, userId)
        return NextResponse.json({
          success: true,
          message: 'Bot resumed successfully',
          status: 'running',
        })

      case 'status':
        const status = botRunnerManager.getInstanceStatus(botId)
        if (!status) {
          return NextResponse.json(
            { error: 'Bot instance not found' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          status: {
            botId: status.botId,
            status: status.status,
            startedAt: status.startedAt,
            lastHeartbeat: status.lastHeartbeat,
            error: status.error,
          },
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('[v0] Bot control error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
