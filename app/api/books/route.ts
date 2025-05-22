import { NextResponse } from "next/server"
import { mockBooks } from "@/lib/mock-data"

export async function GET() {
  // Return mock data instead of querying the database
  return NextResponse.json(mockBooks)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Simulate creating a new book
    const newBook = {
      id: mockBooks.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(newBook)
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}
