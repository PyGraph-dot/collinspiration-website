// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Your NextAuth configuration
import { sql } from '@vercel/postgres'; // Assuming you're using Vercel Postgres client or similar, adjust path as needed
import { z } from "zod";
import type { Session } from "next-auth"; // <--- ADDED: Import Session type

// --- ADDED: Type definitions for custom session user and session ---
interface SessionUser {
  id: string; // Assuming user has an ID
  email: string; // Assuming user has an email
  role: "ADMIN" | "USER"; // Define possible roles
  // Add other properties if your session user object has them
}

interface CustomSession extends Session {
  user?: SessionUser;
}
// --- END ADDED ---

// Zod schema for category creation
const CategoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().optional(),
});

export async function GET() {
  try {
    // You might want to add authentication here if only admins should fetch all categories
    // const session = await getServerSession(authOptions) as CustomSession; // <--- ADDED: Cast session to CustomSession
    // if (!session || !session.user || session.user.role !== "ADMIN") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { rows: categories } = await sql`
      SELECT
        id,
        name,
        description,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM categories
      ORDER BY name ASC
    `;

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Ensure only admins can create categories.
    const session = await getServerSession(authOptions) as CustomSession; // <--- ADDED: Cast session to CustomSession
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Zod validation
    const parsed = CategoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const result = await sql`
      INSERT INTO categories (
        name,
        description,
        status
      ) VALUES (
        ${data.name},
        ${data.description},
        ${data.status || "active"}
      ) RETURNING id, name, description, status, created_at as "createdAt", updated_at as "updatedAt";
    `;

    // The 'rows' property contains the inserted data
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}