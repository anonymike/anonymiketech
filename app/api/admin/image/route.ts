import { put, list } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"

const ADMIN_IMAGE_KEY = "admin/profile-image.json"

interface AdminImageData {
  url: string
  uploadedAt: string
  fileName: string
}

async function getStoredImage(): Promise<AdminImageData | null> {
  try {
    const { blobs } = await list({ prefix: "admin/profile-image" })
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.error("Error fetching admin image:", error)
  }
  return null
}

// GET: retrieve admin image URL
export async function GET() {
  try {
    const imageData = await getStoredImage()
    if (imageData) {
      return NextResponse.json(imageData)
    }
    return NextResponse.json({ url: null }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve image" }, { status: 500 })
  }
}

// POST: upload new admin image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Upload to blob storage
    const buffer = await file.arrayBuffer()
    const blob = await put(`admin/profile-images/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    })

    // Store metadata in JSON file
    const imageData: AdminImageData = {
      url: blob.url,
      uploadedAt: new Date().toISOString(),
      fileName: file.name,
    }

    await put(ADMIN_IMAGE_KEY, JSON.stringify(imageData), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    })

    return NextResponse.json({ success: true, image: imageData }, { status: 201 })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

// DELETE: remove admin image
export async function DELETE() {
  try {
    // Create a null entry to effectively delete
    await put(ADMIN_IMAGE_KEY, JSON.stringify({ url: null, uploadedAt: null, fileName: null }), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
