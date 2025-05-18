import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const categories = await sql`
      SELECT 
        id, 
        name, 
        description, 
        status, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM categories
      ORDER BY name ASC
    `

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await sql`
      INSERT INTO categories (
        name, 
        description, 
        status
      ) VALUES (
        ${body.name}, 
        ${body.description}, 
        ${body.status || "active"}
      ) RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
