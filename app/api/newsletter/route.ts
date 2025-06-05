import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { z } from "zod"

// Zod schema for newsletter subscription
const NewsletterSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Zod validation
    const parsed = NewsletterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please check the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }
    const data = parsed.data

    // Check if email already exists
    const existingSubscriber = await sql`
      SELECT id FROM newsletter_subscribers
      WHERE email = ${data.email}
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
        ${data.email}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    })
  } catch (error: unknown) { // Corrected: Changed 'any' to 'unknown'
    console.error("Error subscribing to newsletter:", error)
    let errorMessage = "Failed to subscribe. Please try again."

    // Safely access properties of the error object
    if (error && typeof error === 'object' && 'code' in error && error.code === "23505") {
      errorMessage = "This email is already subscribed."
    } else if (error instanceof Error && error.message.includes("invalid input syntax")) { // Check for specific message
      errorMessage = "Please provide a valid email address."
    } else if (error instanceof Error) { // Check if it's a standard Error object
      errorMessage = error.message
    } else if (typeof error === 'string') { // Handle cases where error might be a string
      errorMessage = error;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
