import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const books = await sql`
      SELECT 
        b.id, 
        b.title, 
        b.description, 
        b.cover_image as "coverImage", 
        b.price, 
        c.name as category, 
        b.type, 
        b.amazon_link as "amazonLink", 
        b.nigerian_link as "nigerianLink", 
        b.status, 
        b.created_at as "createdAt", 
        b.updated_at as "updatedAt"
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.status = 'published'
      ORDER BY b.created_at DESC
    `

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Get category ID from category name
    const categoryResult = await sql`
      SELECT id FROM categories WHERE name = ${body.category}
    `

    const categoryId = categoryResult[0]?.id || null

    // Insert the new book
    const result = await sql`
      INSERT INTO books (
        title, 
        description, 
        cover_image, 
        price, 
        category_id, 
        type, 
        amazon_link, 
        nigerian_link, 
        status
      ) VALUES (
        ${body.title}, 
        ${body.description}, 
        ${body.coverImage}, 
        ${body.price}, 
        ${categoryId}, 
        ${body.type}, 
        ${body.amazonLink}, 
        ${body.nigerianLink}, 
        ${body.status || "draft"}
      ) RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}
