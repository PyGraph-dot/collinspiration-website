// app/api/categories/route.ts
import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // <--- REMOVE THIS LINE if you're using direct SQL
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth"; // Your NextAuth configuration

import { sql } from '@vercel/postgres'; // Assuming you're using Vercel Postgres client or similar, adjust path as needed

export async function GET() {
  try {
    // You might want to add authentication here if only admins should fetch all categories
    // const session = await getServerSession(authOptions);
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
    // You should add Zod validation here for the incoming body, similar to how you did for books.
    // Ensure only admins can create categories.
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user || session.user.role !== "ADMIN") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();

    // Basic validation (consider Zod for robust validation)
    if (!body.name || !body.description) {
      return NextResponse.json({ message: "Name and description are required." }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO categories (
        name,
        description,
        status
      ) VALUES (
        ${body.name},
        ${body.description},
        ${body.status || "active"}
      ) RETURNING id, name, description, status, created_at as "createdAt", updated_at as "updatedAt";
    `;

    // The 'rows' property contains the inserted data
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}