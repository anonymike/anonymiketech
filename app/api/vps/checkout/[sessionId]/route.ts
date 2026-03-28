import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session.url) {
      return NextResponse.json({ error: "No checkout URL found" }, { status: 400 })
    }

    // Redirect to Stripe
    return NextResponse.redirect(session.url)
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    return NextResponse.json(
      { error: "Failed to retrieve checkout session" },
      { status: 500 }
    )
  }
}
