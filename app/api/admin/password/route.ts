import { put, list } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"

const PASSWORD_BLOB_KEY = "admin/password.json"
const DEFAULT_PASSWORD = "ANONYMIKE2026"

async function getStoredPassword(): Promise<string> {
  try {
    const { blobs } = await list({ prefix: "admin/password" })
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      const data = await res.json()
      return data.password || DEFAULT_PASSWORD
    }
  } catch {
    // Blob not found or error, return default
  }
  return DEFAULT_PASSWORD
}

// POST: verify password
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const stored = await getStoredPassword()
    const valid = password === stored
    return NextResponse.json({ valid })
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 })
  }
}

// PUT: change password
export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()
    const stored = await getStoredPassword()

    if (currentPassword !== stored) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
    }

    await put(PASSWORD_BLOB_KEY, JSON.stringify({ password: newPassword }), {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
