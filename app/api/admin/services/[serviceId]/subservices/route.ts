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

async function getStoredServices(): Promise<Service[]> {
  try {
    const { blobs } = await list({ prefix: "admin/services" })
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      const data = await res.json()
      return data.services || []
    }
  } catch {
    // Blob not found
  }
  return []
}

async function saveServices(services: Service[]): Promise<void> {
  await put(SERVICES_BLOB_KEY, JSON.stringify({ services }), {
    access: "public",
    addRandomSuffix: false,
  })
}

// POST: add sub-service to a service
export async function POST(request: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const { serviceId } = await params
    const { name, price } = await request.json()

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const services = await getStoredServices()
    const service = services.find((s) => s.id === serviceId)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const newSubService: SubService = {
      id: `subservice-${Date.now()}`,
      name,
      price,
      quantity: 0,
    }

    service.subServices.push(newSubService)
    service.updatedAt = new Date().toISOString()

    await saveServices(services)
    return NextResponse.json({ success: true, subService: newSubService })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add sub-service" }, { status: 500 })
  }
}

// PUT: update sub-service
export async function PUT(request: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const { serviceId } = await params
    const { subServiceId, name, price } = await request.json()

    if (!subServiceId) {
      return NextResponse.json({ error: "Sub-service ID is required" }, { status: 400 })
    }

    const services = await getStoredServices()
    const service = services.find((s) => s.id === serviceId)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const subServiceIndex = service.subServices.findIndex((ss) => ss.id === subServiceId)

    if (subServiceIndex === -1) {
      return NextResponse.json({ error: "Sub-service not found" }, { status: 404 })
    }

    service.subServices[subServiceIndex] = {
      ...service.subServices[subServiceIndex],
      ...(name && { name }),
      ...(price !== undefined && { price }),
    }

    service.updatedAt = new Date().toISOString()

    await saveServices(services)
    return NextResponse.json({ success: true, subService: service.subServices[subServiceIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update sub-service" }, { status: 500 })
  }
}

// DELETE: remove sub-service
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const { serviceId } = await params
    const { subServiceId } = await request.json()

    if (!subServiceId) {
      return NextResponse.json({ error: "Sub-service ID is required" }, { status: 400 })
    }

    const services = await getStoredServices()
    const service = services.find((s) => s.id === serviceId)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const originalLength = service.subServices.length
    service.subServices = service.subServices.filter((ss) => ss.id !== subServiceId)

    if (service.subServices.length === originalLength) {
      return NextResponse.json({ error: "Sub-service not found" }, { status: 404 })
    }

    service.updatedAt = new Date().toISOString()

    await saveServices(services)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete sub-service" }, { status: 500 })
  }
}
