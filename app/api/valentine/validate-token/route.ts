import { NextResponse } from 'next/server'

// In-memory token storage (in production, this would be a database)
// Format: { token: string, characters: number, active: boolean, createdAt: string }
let valentineTokens: Array<{
  token: string
  characters: number
  active: boolean
  createdAt: string
}> = []

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Find token in storage
    const foundToken = valentineTokens.find(
      t => t.token.trim().toUpperCase() === token.trim().toUpperCase() && t.active
    )

    if (!foundToken) {
      return NextResponse.json(
        { error: 'Token not found or inactive', valid: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      characters: foundToken.characters,
      message: `Token valid! You can now write up to ${foundToken.characters} characters.`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve all tokens (admin only)
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  // Simple auth check (in production, use proper authentication)
  if (authHeader !== 'Bearer admin-secret-key') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return NextResponse.json({ tokens: valentineTokens })
}

// PUT endpoint to add/update tokens (admin only)
export async function PUT(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader !== 'Bearer admin-secret-key') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { token, characters, action } = await request.json()

    if (action === 'add') {
      const newToken = {
        token: token.toUpperCase(),
        characters: parseInt(characters),
        active: true,
        createdAt: new Date().toISOString(),
      }
      valentineTokens.push(newToken)
      return NextResponse.json({ success: true, data: newToken })
    } else if (action === 'delete') {
      valentineTokens = valentineTokens.filter(t => t.token !== token.toUpperCase())
      return NextResponse.json({ success: true, message: 'Token deleted' })
    } else if (action === 'toggle') {
      const tokenObj = valentineTokens.find(t => t.token === token.toUpperCase())
      if (tokenObj) {
        tokenObj.active = !tokenObj.active
        return NextResponse.json({ success: true, data: tokenObj })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update token' },
      { status: 500 }
    )
  }
}
