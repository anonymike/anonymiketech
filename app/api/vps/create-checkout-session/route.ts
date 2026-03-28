import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface OrderData {
  plan: string
  location: string
  billingCycle: string
  os: string
  hostname: string
  sshKey: string
  promoCode?: string
  currency: "USD" | "KSH"
  pricing: {
    basePrice: number
    monthlyPrice: number
    totalPrice: number
    discount: number
    promoDiscount: number
    finalPrice: number
  }
}

const PLAN_DETAILS = {
  "s-plan": { name: "VPS S - Starter", cpu: 3, ram: 6, storage: 50 },
  "m-plan": { name: "VPS M - Professional", cpu: 6, ram: 16, storage: 100 },
  "l-plan": { name: "VPS L - Business", cpu: 8, ram: 32, storage: 200 },
  "xl-plan": { name: "VPS XL - Enterprise", cpu: 12, ram: 64, storage: 400 },
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    // Convert price to cents for Stripe (if USD)
    let amount = Math.round(orderData.pricing.finalPrice * 100)

    // If KSH, convert to the appropriate amount (Stripe expects cents for all currencies)
    if (orderData.currency === "KSH") {
      // Keep it as is since it's already in whole numbers
      amount = Math.round(orderData.pricing.finalPrice)
    }

    const plan = PLAN_DETAILS[orderData.plan as keyof typeof PLAN_DETAILS]

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: orderData.currency.toLowerCase(),
            product_data: {
              name: plan.name,
              description: `${plan.cpu} CPU cores, ${plan.ram}GB RAM, ${plan.storage}GB NVMe storage`,
              metadata: {
                planId: orderData.plan,
                location: orderData.location,
                os: orderData.os,
                hostname: orderData.hostname,
              },
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId: orderData.plan,
        location: orderData.location,
        billingCycle: orderData.billingCycle,
        os: orderData.os,
        hostname: orderData.hostname,
        currency: orderData.currency,
        promoCode: orderData.promoCode || "none",
      },
      customer_email: "temporary@example.com", // Will be replaced with actual email
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/vps/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/vps/cancel`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
