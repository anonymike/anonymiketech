import { NextRequest, NextResponse } from 'next/server'
import { botRunnerManager } from '@/lib/bot-runner'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const botId = searchParams.get('botId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const stream = searchParams.get('stream') === 'true'

    if (!botId || !userId) {
      return NextResponse.json(
        { error: 'Missing required query params: botId, userId' },
        { status: 400 }
      )
    }

    if (stream) {
      // Server-Sent Events for real-time logs
      return new NextResponse(
        new ReadableStream({
          start(controller) {
            // Send initial logs
            const logs = botRunnerManager.getLogs(botId, limit)
            controller.enqueue(
              `data: ${JSON.stringify({ type: 'initial_logs', logs })}\n\n`
            )

            // Listen for new logs
            const logListener = (log: any) => {
              if (log.botId === botId) {
                controller.enqueue(
                  `data: ${JSON.stringify({ type: 'new_log', log })}\n\n`
                )
              }
            }

            botRunnerManager.on('log:created', logListener)

            // Cleanup on disconnect
            const cleanup = () => {
              botRunnerManager.removeListener('log:created', logListener)
              controller.close()
            }

            request.signal.addEventListener('abort', cleanup)
          },
        }),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    } else {
      // Standard GET for logs
      const logs = botRunnerManager.getLogs(botId, limit)
      return NextResponse.json({
        success: true,
        botId,
        logs,
        count: logs.length,
      })
    }
  } catch (error) {
    console.error('[v0] Logs API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
