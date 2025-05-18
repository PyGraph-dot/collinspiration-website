import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const result = await sql`
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
      WHERE b.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Get category ID from category name
    const categoryResult = await sql`
      SELECT id FROM categories WHERE name = ${body.category}
    `

    const categoryId = categoryResult[0]?.id || null

    // Update the book
    const result = await sql`
      UPDATE books
      SET 
        title = ${body.title},
        description = ${body.description},
        cover_image = ${body.coverImage},
        price = ${body.price},
        category_id = ${categoryId},
        type = ${body.type},
        amazon_link = ${body.amazonLink},
        nigerian_link = ${body.nigerianLink},
        status = ${body.status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const result = await sql`
      DELETE FROM books
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}
