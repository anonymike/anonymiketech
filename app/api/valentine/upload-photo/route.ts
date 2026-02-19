import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be smaller than 5MB' }, { status: 400 })
    }

    // Upload to Vercel Blob with a valentine-specific path
    const blob = await put(`valentine-photos/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    return NextResponse.json({
      url: blob.url,
    })
  } catch (error) {
    console.error('Valentine photo upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
