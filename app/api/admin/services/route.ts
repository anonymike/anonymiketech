import { put, list } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"
import { v4 as uuidv4 } from 'uuid'

const SERVICES_BLOB_KEY = "admin/services.json"

export interface Package {
  id: string
  name: string
  price: number
  features: string[]
  description?: string
}

export interface SubService {
  id: string
  name: string
  packages: Package[]
}

export interface Service {
  id: string
  name: string
  icon: string
  category: string
  description?: string
  subServices: SubService[]
  createdAt: string
  updatedAt: string
}

interface ServicesData {
  services: Service[]
  lastUpdated: string
}

// Default services data
const DEFAULT_SERVICES: ServicesData = {
  services: [
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '📱',
      category: 'Messaging',
      description: 'Boost your Telegram presence',
      subServices: [
        {
          id: 'telegram-members',
          name: 'Members',
          packages: [
            {
              id: 'telegram-members-starter',
              name: 'Starter',
              price: 5000,
              features: ['100 Members', '24-hour delivery', 'Real members'],
            },
            {
              id: 'telegram-members-growth',
              name: 'Growth',
              price: 12000,
              features: ['500 Members', '48-hour delivery', 'Real members', 'Retention guaranteed'],
            },
          ],
        },
        {
          id: 'telegram-views',
          name: 'Views',
          packages: [
            {
              id: 'telegram-views-basic',
              name: 'Basic',
              price: 3000,
              features: ['1000 Views', '24-hour delivery'],
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: '𝕏',
      category: 'Social Media',
      description: 'Grow your Twitter/X following',
      subServices: [
        {
          id: 'twitter-followers',
          name: 'Followers',
          packages: [
            {
              id: 'twitter-followers-starter',
              name: 'Starter',
              price: 8000,
              features: ['200 Followers', '24-hour delivery'],
            },
          ],
        },
        {
          id: 'twitter-likes',
          name: 'Likes',
          packages: [
            {
              id: 'twitter-likes-basic',
              name: 'Basic',
              price: 4000,
              features: ['500 Likes', '24-hour delivery'],
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      category: 'Messaging',
      description: 'Expand your WhatsApp Business',
      subServices: [
        {
          id: 'whatsapp-channel-members',
          name: 'Channel Members',
          packages: [
            {
              id: 'whatsapp-channel-starter',
              name: 'Starter',
              price: 6000,
              features: ['500 Members', '24-hour delivery'],
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'spotify',
      name: 'Spotify',
      icon: '🎵',
      category: 'Music',
      description: 'Boost your Spotify presence',
      subServices: [
        {
          id: 'spotify-followers',
          name: 'Followers',
          packages: [
            {
              id: 'spotify-followers-starter',
              name: 'Starter',
              price: 7000,
              features: ['300 Followers', '48-hour delivery'],
            },
          ],
        },
        {
          id: 'spotify-plays',
          name: 'Plays',
          packages: [
            {
              id: 'spotify-plays-basic',
              name: 'Basic',
              price: 5000,
              features: ['1000 Plays', '24-hour delivery'],
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'canva-chatgpt',
      name: 'Canva | ChatGPT',
      icon: '🎨',
      category: 'Tools',
      description: 'Premium design and AI tools',
      subServices: [
        {
          id: 'canva-premium',
          name: 'Canva Premium',
          packages: [
            {
              id: 'canva-premium-monthly',
              name: 'Monthly',
              price: 3000,
              features: ['1 month access', 'All premium features'],
            },
            {
              id: 'canva-premium-yearly',
              name: 'Yearly',
              price: 25000,
              features: ['12 months access', 'All premium features'],
            },
          ],
        },
        {
          id: 'chatgpt-plus',
          name: 'ChatGPT Plus',
          packages: [
            {
              id: 'chatgpt-plus-monthly',
              name: 'Monthly',
              price: 4000,
              features: ['1 month access', 'GPT-4 access'],
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'african-services',
      name: 'African | Kenyan Services',
      icon: '🇰🇪',
      category: 'Local',
      description: 'African and Kenyan specialized services',
      subServices: [
        {
          id: 'mobile-money',
          name: 'Mobile Money',
          packages: [
            {
              id: 'mpesa-airtime',
              name: 'M-PESA Airtime',
              price: 1000,
              features: ['Instant delivery', 'All networks'],
            },
          ],
        },
        {
          id: 'sms-campaigns',
          name: 'SMS Campaigns',
          packages: [
            {
              id: 'sms-starter',
              name: 'Starter',
              price: 5000,
              features: ['100 SMS', 'Bulk delivery'],
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  lastUpdated: new Date().toISOString(),
}

async function getStoredServices(): Promise<ServicesData> {
  try {
    const { blobs } = await list({ prefix: "admin/services" })
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching services:', error)
  }
  return DEFAULT_SERVICES
}

async function saveServices(data: ServicesData): Promise<void> {
  await put(SERVICES_BLOB_KEY, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
  })
}

// GET: retrieve all services
export async function GET() {
  try {
    const data = await getStoredServices()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ error: "Failed to retrieve services" }, { status: 500 })
  }
}

// POST: create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, icon, category, description, subServices } = body

    if (!name || !icon || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const data = await getStoredServices()
    const newService: Service = {
      id: body.id || uuidv4(),
      name,
      icon,
      category,
      description,
      subServices: subServices || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.services.push(newService)
    data.lastUpdated = new Date().toISOString()
    await saveServices(data)

    return NextResponse.json({ success: true, service: newService }, { status: 201 })
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

// PUT: update a service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, icon, category, description, subServices } = body

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const data = await getStoredServices()
    const serviceIndex = data.services.findIndex((s) => s.id === id)

    if (serviceIndex === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const updatedService: Service = {
      id,
      name: name || data.services[serviceIndex].name,
      icon: icon || data.services[serviceIndex].icon,
      category: category || data.services[serviceIndex].category,
      description: description !== undefined ? description : data.services[serviceIndex].description,
      subServices: subServices !== undefined ? subServices : data.services[serviceIndex].subServices,
      createdAt: data.services[serviceIndex].createdAt,
      updatedAt: new Date().toISOString(),
    }

    data.services[serviceIndex] = updatedService
    data.lastUpdated = new Date().toISOString()
    await saveServices(data)

    return NextResponse.json({ success: true, service: updatedService })
  } catch (error) {
    console.error('Error in PUT:', error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

// DELETE: delete a service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const data = await getStoredServices()
    const serviceIndex = data.services.findIndex((s) => s.id === id)

    if (serviceIndex === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    data.services.splice(serviceIndex, 1)
    data.lastUpdated = new Date().toISOString()
    await saveServices(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE:', error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
