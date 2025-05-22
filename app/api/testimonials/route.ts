import { NextResponse } from "next/server"
import { mockTestimonials } from "@/lib/mock-data"

export async function GET() {
  // Return mock data instead of querying the database
  return NextResponse.json(mockTestimonials)
}
