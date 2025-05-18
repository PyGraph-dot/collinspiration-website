import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const testimonials = await sql`
      SELECT 
        id, 
        name, 
        title, 
        content, 
        avatar, 
        rating, 
        status, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM testimonials
      WHERE status = 'active'
      ORDER BY created_at DESC
    `

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
