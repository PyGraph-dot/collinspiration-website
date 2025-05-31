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

    const result = await sql`
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
  } catch (error: any) {
    console.error("Error submitting contact form:", error)
    // Provide more specific error messages if possible
    let errorMessage = "Failed to submit your message. Please try again."
    if (error?.code === "23505") {
      errorMessage = "A message with this email already exists."
    } else if (error?.message) {
      errorMessage = error.message
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
