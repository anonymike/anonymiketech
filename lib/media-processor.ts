import fs from 'fs'
import path from 'path'
import { createReadStream, createWriteStream } from 'fs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// ============ Media Processor Types ============

export interface MediaFile {
  id: string
  botId: string
  messageId: string
  type: 'image' | 'video' | 'audio' | 'document'
  mimeType: string
  filename: string
  size: number
  url?: string
  localPath?: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
    dimensions?: string
  }
  createdAt: Date
  processedAt?: Date
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
}

export interface ProcessingOptions {
  resize?: { width: number; height: number; quality?: number }
  compress?: { quality?: number; maxSize?: number }
  thumbnail?: { width: number; height: number }
  extractMetadata?: boolean
}

// ============ Media Processor ============

class MediaProcessor {
  private mediaDir = path.join(process.cwd(), '.media')
  private tempDir = path.join(this.mediaDir, 'temp')
  private processedDir = path.join(this.mediaDir, 'processed')

  constructor() {
    this.ensureDirectories()
  }

  /**
   * Ensure required directories exist
   */
  private ensureDirectories(): void {
    for (const dir of [this.mediaDir, this.tempDir, this.processedDir]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    }
  }

  /**
   * Save uploaded media file
   */
  async saveMediaFile(
    botId: string,
    messageId: string,
    file: {
      buffer: Buffer
      originalname: string
      mimetype: string
      size: number
    }
  ): Promise<MediaFile> {
    const mediaId = `${messageId}-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const ext = path.extname(file.originalname)
    const filename = `${mediaId}${ext}`
    const filePath = path.join(this.mediaDir, botId, filename)

    // Ensure bot directory exists
    const botDir = path.dirname(filePath)
    if (!fs.existsSync(botDir)) {
      fs.mkdirSync(botDir, { recursive: true })
    }

    // Save file
    fs.writeFileSync(filePath, file.buffer)

    const media: MediaFile = {
      id: mediaId,
      botId,
      messageId,
      type: this.inferMediaType(file.mimetype),
      mimeType: file.mimetype,
      filename: file.originalname,
      size: file.size,
      localPath: filePath,
      createdAt: new Date(),
      status: 'pending',
    }

    // Save to database
    await this.saveMediaToDB(media)

    return media
  }

  /**
   * Process media file with options
   */
  async processMedia(
    mediaId: string,
    botId: string,
    options: ProcessingOptions = {}
  ): Promise<MediaFile | null> {
    try {
      const media = await this.getMedia(mediaId)
      if (!media) return null

      media.status = 'processing'
      await this.saveMediaToDB(media)

      // Extract metadata if requested
      if (options.extractMetadata && media.type === 'image') {
        media.metadata = await this.extractImageMetadata(media.localPath!)
      }

      // Apply transformations based on media type
      if (media.type === 'image' && options.resize) {
        await this.resizeImage(media, options.resize)
      }

      if (media.type === 'video' && options.thumbnail) {
        await this.extractThumbnail(media, options.thumbnail)
      }

      if (options.compress) {
        await this.compressMedia(media, options.compress)
      }

      media.status = 'completed'
      media.processedAt = new Date()
      await this.saveMediaToDB(media)

      return media
    } catch (error) {
      console.error('[v0] Media processing error:', error)
      const media = await this.getMedia(mediaId)
      if (media) {
        media.status = 'failed'
        media.error = error instanceof Error ? error.message : 'Unknown error'
        await this.saveMediaToDB(media)
      }
      return null
    }
  }

  /**
   * Infer media type from MIME type
   */
  private inferMediaType(mimeType: string): 'image' | 'video' | 'audio' | 'document' {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'document'
  }

  /**
   * Extract image metadata
   */
  private async extractImageMetadata(filePath: string): Promise<Record<string, any>> {
    try {
      // In production, use sharp or imagemagick for detailed metadata
      const stats = fs.statSync(filePath)
      return {
        size: stats.size,
        modifiedAt: stats.mtime.toISOString(),
      }
    } catch (err) {
      console.error('[v0] Error extracting image metadata:', err)
      return {}
    }
  }

  /**
   * Resize image
   */
  private async resizeImage(
    media: MediaFile,
    options: { width: number; height: number; quality?: number }
  ): Promise<void> {
    // In production, implement with sharp library
    console.log(`[v0] Would resize image ${media.id} to ${options.width}x${options.height}`)
    // This requires installing: npm install sharp
  }

  /**
   * Extract video thumbnail
   */
  private async extractThumbnail(
    media: MediaFile,
    options: { width: number; height: number }
  ): Promise<void> {
    // In production, implement with ffmpeg
    console.log(`[v0] Would extract thumbnail from ${media.id} as ${options.width}x${options.height}`)
    // This requires installing: npm install fluent-ffmpeg
  }

  /**
   * Compress media
   */
  private async compressMedia(
    media: MediaFile,
    options: { quality?: number; maxSize?: number }
  ): Promise<void> {
    // In production, implement compression based on media type
    console.log(`[v0] Would compress ${media.id} with quality ${options.quality}`)
  }

  /**
   * Get media by ID
   */
  async getMedia(mediaId: string): Promise<MediaFile | null> {
    try {
      const { data } = await supabase
        .from('media_files')
        .select('*')
        .eq('id', mediaId)
        .single()

      if (!data) return null

      return {
        id: data.id,
        botId: data.bot_id,
        messageId: data.message_id,
        type: data.type,
        mimeType: data.mime_type,
        filename: data.filename,
        size: data.size,
        url: data.url,
        localPath: data.local_path,
        metadata: data.metadata,
        createdAt: new Date(data.created_at),
        processedAt: data.processed_at ? new Date(data.processed_at) : undefined,
        status: data.status,
        error: data.error,
      }
    } catch (err) {
      console.error('[v0] Error fetching media:', err)
      return null
    }
  }

  /**
   * Get media files for a message
   */
  async getMessageMedia(botId: string, messageId: string): Promise<MediaFile[]> {
    try {
      const { data } = await supabase
        .from('media_files')
        .select('*')
        .eq('bot_id', botId)
        .eq('message_id', messageId)

      return (data || []).map((d: any) => ({
        id: d.id,
        botId: d.bot_id,
        messageId: d.message_id,
        type: d.type,
        mimeType: d.mime_type,
        filename: d.filename,
        size: d.size,
        url: d.url,
        localPath: d.local_path,
        metadata: d.metadata,
        createdAt: new Date(d.created_at),
        processedAt: d.processed_at ? new Date(d.processed_at) : undefined,
        status: d.status,
        error: d.error,
      }))
    } catch (err) {
      console.error('[v0] Error fetching message media:', err)
      return []
    }
  }

  /**
   * Delete media file
   */
  async deleteMedia(mediaId: string, botId: string): Promise<boolean> {
    try {
      const media = await this.getMedia(mediaId)
      if (!media) return false

      // Delete from disk
      if (media.localPath && fs.existsSync(media.localPath)) {
        fs.unlinkSync(media.localPath)
      }

      // Delete from database
      await supabase
        .from('media_files')
        .delete()
        .eq('id', mediaId)

      return true
    } catch (err) {
      console.error('[v0] Error deleting media:', err)
      return false
    }
  }

  /**
   * Cleanup old media files
   */
  async cleanupOldMedia(retentionDays: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

      const { data } = await supabase
        .from('media_files')
        .select('id, bot_id')
        .lt('created_at', cutoffDate.toISOString())

      let deletedCount = 0
      for (const media of data || []) {
        if (await this.deleteMedia(media.id, media.bot_id)) {
          deletedCount++
        }
      }

      return deletedCount
    } catch (err) {
      console.error('[v0] Error cleaning up old media:', err)
      return 0
    }
  }

  /**
   * Save media to database
   */
  private async saveMediaToDB(media: MediaFile): Promise<void> {
    try {
      await supabase
        .from('media_files')
        .upsert({
          id: media.id,
          bot_id: media.botId,
          message_id: media.messageId,
          type: media.type,
          mime_type: media.mimeType,
          filename: media.filename,
          size: media.size,
          url: media.url,
          local_path: media.localPath,
          metadata: media.metadata,
          created_at: media.createdAt.toISOString(),
          processed_at: media.processedAt?.toISOString(),
          status: media.status,
          error: media.error,
        })
    } catch (err) {
      console.error('[v0] Error saving media to DB:', err)
    }
  }
}

export const mediaProcessor = new MediaProcessor()
