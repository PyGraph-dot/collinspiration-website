import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const blogPosts = await sql`
      SELECT 
        id, 
        title, 
        slug, 
        excerpt, 
        content, 
        cover_image as "coverImage", 
        category, 
        author_id as "authorId", 
        status, 
        published_at as "publishedAt", 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC
    `

    return NextResponse.json(blogPosts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
