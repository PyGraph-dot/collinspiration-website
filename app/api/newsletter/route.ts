import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Check if email already exists
    const existingSubscriber = await sql`
      SELECT id FROM newsletter_subscribers
      WHERE email = ${body.email}
    `

    if (existingSubscriber.length > 0) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed to our newsletter!",
      })
    }

    // Add new subscriber
    await sql`
      INSERT INTO newsletter_subscribers (
        email
      ) VALUES (
        ${body.email}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to subscribe. Please try again.",
      },
      { status: 500 },
    )
  }
}
