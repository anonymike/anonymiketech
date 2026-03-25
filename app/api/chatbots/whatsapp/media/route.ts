import { NextRequest, NextResponse } from 'next/server'
import { mediaProcessor } from '@/lib/media-processor'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const botId = formData.get('botId') as string
    const messageId = formData.get('messageId') as string
    const userId = formData.get('userId') as string

    if (!file || !botId || !messageId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, botId, messageId, userId' },
        { status: 400 }
      )
    }

    // Convert File to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Save media file
    const media = await mediaProcessor.saveMediaFile(botId, messageId, {
      buffer,
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
    })

    return NextResponse.json({
      success: true,
      media: {
        id: media.id,
        type: media.type,
        filename: media.filename,
        size: media.size,
        status: media.status,
        createdAt: media.createdAt,
      },
    })
  } catch (error) {
    console.error('[v0] Media upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const botId = searchParams.get('botId')
    const mediaId = searchParams.get('mediaId')
    const messageId = searchParams.get('messageId')
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      )
    }

    if (action === 'get' && mediaId && botId) {
      const media = await mediaProcessor.getMedia(mediaId)
      if (!media) {
        return NextResponse.json(
          { error: 'Media not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        media: {
          id: media.id,
          type: media.type,
          filename: media.filename,
          size: media.size,
          url: media.url,
          status: media.status,
          metadata: media.metadata,
          createdAt: media.createdAt,
          processedAt: media.processedAt,
        },
      })
    } else if (action === 'list' && botId && messageId) {
      const mediaFiles = await mediaProcessor.getMessageMedia(botId, messageId)

      return NextResponse.json({
        success: true,
        media: mediaFiles.map((m) => ({
          id: m.id,
          type: m.type,
          filename: m.filename,
          size: m.size,
          status: m.status,
          createdAt: m.createdAt,
        })),
        count: mediaFiles.length,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action or missing parameters' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('[v0] Media GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get('mediaId')
    const botId = searchParams.get('botId')
    const userId = searchParams.get('userId')

    if (!mediaId || !botId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: mediaId, botId, userId' },
        { status: 400 }
      )
    }

    const success = await mediaProcessor.deleteMedia(mediaId, botId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete media' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    })
  } catch (error) {
    console.error('[v0] Media delete error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
