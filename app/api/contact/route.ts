import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await sql`
      INSERT INTO contact_messages (
        name, 
        email, 
        subject, 
        message
      ) VALUES (
        ${body.name}, 
        ${body.email}, 
        ${body.subject}, 
        ${body.message}
      ) RETURNING *
    `

    // Here you could also add email notification logic

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit your message. Please try again.",
      },
      { status: 500 },
    )
  }
}
