// app/api/contact/route.ts
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { z } from "zod"

// Zod schema for contact form validation
const ContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Zod validation
    const parsed = ContactMessageSchema.safeParse(body)
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

    // Corrected: Renamed 'result' to '_result' to indicate it's intentionally unused
    const _result = await sql`
      INSERT INTO contact_messages (
        name,
        email,
        subject,
        message
      ) VALUES (
        ${data.name},
        ${data.email},
        ${data.subject},
        ${data.message}
      ) RETURNING *
    `

    // Here you could also add email notification logic

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    })
  } catch (error: unknown) { // Corrected: Changed 'any' to 'unknown'
    console.error("Error submitting contact form:", error)
    // Provide more specific error messages if possible
    let errorMessage = "Failed to submit your message. Please try again."

    // Safely access properties of the error object
    if (error && typeof error === 'object' && 'code' in error && error.code === "23505") {
      errorMessage = "A message with this email already exists."
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
