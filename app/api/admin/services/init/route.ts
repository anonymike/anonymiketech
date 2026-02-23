import { put, list } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"

const SERVICES_BLOB_KEY = "admin/services.json"

interface SubService {
  id: string
  name: string
  price: number
  quantity?: number
}

interface Service {
  id: string
  name: string
  icon: string
  category: string
  subServices: SubService[]
  createdAt: string
  updatedAt: string
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "service-telegram",
    name: "Telegram",
    icon: "📱",
    category: "Popular",
    subServices: [
      { id: "sub-telegram-members-1k", name: "1000 Members", price: 500, quantity: 0 },
      { id: "sub-telegram-members-5k", name: "5000 Members", price: 2000, quantity: 0 },
      { id: "sub-telegram-members-10k", name: "10000 Members", price: 3500, quantity: 0 },
      { id: "sub-telegram-views", name: "Post Views (10k)", price: 800, quantity: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-twitter",
    name: "X - Twitter",
    icon: "𝕏",
    category: "Popular",
    subServices: [
      { id: "sub-twitter-followers-1k", name: "1000 Followers", price: 600, quantity: 0 },
      { id: "sub-twitter-followers-5k", name: "5000 Followers", price: 2500, quantity: 0 },
      { id: "sub-twitter-followers-10k", name: "10000 Followers", price: 4500, quantity: 0 },
      { id: "sub-twitter-likes-1k", name: "1000 Likes", price: 400, quantity: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-whatsapp",
    name: "WhatsApp",
    icon: "💬",
    category: "Popular",
    subServices: [
      { id: "sub-whatsapp-group-members", name: "Group Members (100)", price: 300, quantity: 0 },
      { id: "sub-whatsapp-status-views", name: "Status Views (1000)", price: 500, quantity: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-spotify",
    name: "Spotify",
    icon: "🎵",
    category: "Popular",
    subServices: [
      { id: "sub-spotify-plays-1k", name: "1000 Plays", price: 400, quantity: 0 },
      { id: "sub-spotify-plays-10k", name: "10000 Plays", price: 2000, quantity: 0 },
      { id: "sub-spotify-followers", name: "100 Followers", price: 600, quantity: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-canva",
    name: "Canva",
    icon: "🎨",
    category: "Free Services",
    subServices: [
      { id: "sub-canva-views", name: "Design Views (1000)", price: 200, quantity: 0 },
      { id: "sub-canva-shares", name: "Design Shares (500)", price: 300, quantity: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-chatgpt",
    name: "ChatGPT",
    icon: "🤖",
    category: "Free Services",
    subServices: [
      { id: "sub-chatgpt-conversation", name: "Premium Conversation", price: 100, quantity: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-kenya",
    name: "African - Kenyan Services",
    icon: "🇰🇪",
    category: "African Services",
    subServices: [
      { id: "sub-kenya-mpesa-boost", name: "M-Pesa Boost Package", price: 1000, quantity: 0 },
      { id: "sub-kenya-safaricom", name: "Safaricom Followers", price: 800, quantity: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function POST(request: NextRequest) {
  try {
    // Check if services already exist
    const { blobs } = await list({ prefix: "admin/services" })

    if (blobs.length > 0) {
      return NextResponse.json(
        { message: "Services already initialized" },
        { status: 400 }
      )
    }

    // Save default services
    await put(SERVICES_BLOB_KEY, JSON.stringify({ services: DEFAULT_SERVICES }), {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({
      success: true,
      message: "Services initialized successfully",
      servicesCount: DEFAULT_SERVICES.length,
    })
  } catch (error) {
    console.error("Initialization error:", error)
    return NextResponse.json(
      { error: "Failed to initialize services" },
      { status: 500 }
    )
  }
}

// GET: Check if services are initialized
export async function GET() {
  try {
    const { blobs } = await list({ prefix: "admin/services" })
    const isInitialized = blobs.length > 0

    return NextResponse.json({
      initialized: isInitialized,
      message: isInitialized ? "Services are initialized" : "Services are not initialized",
    })
  } catch (error) {
    return NextResponse.json(
      { initialized: false, error: "Failed to check initialization status" },
      { status: 500 }
    )
  }
}
