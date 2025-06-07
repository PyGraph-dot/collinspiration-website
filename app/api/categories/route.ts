// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Your NextAuth configuration
import prisma from "@/lib/prisma"; // IMPORTED PRISMA CLIENT
import { z } from "zod";
import type { Session } from "next-auth";

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
  description: z.string().optional().nullable(), // Description can be optional and nullable
  status: z.string().optional(), // Status will default to 'active' in model
});

export async function GET() {
  try {
    // You might want to add authentication here if only admins should fetch all categories
    // const session = await getServerSession(authOptions) as CustomSession;
    // if (!session || !session.user || session.user.role !== "ADMIN") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // USING PRISMA to fetch categories
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: { // Select only necessary fields
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories", details: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Ensure only admins can create categories.
    const session = await getServerSession(authOptions) as CustomSession;
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

    // USING PRISMA to create a category
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || "active", // Default to 'active' if not provided
      },
      select: { // Select only necessary fields to return
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(newCategory, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Error creating category:", error);
    // Handle unique constraint error for 'name' if it exists
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('name')) {
      return NextResponse.json({ message: "Category with this name already exists." }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json({ error: "Failed to create category", details: (error as Error).message }, { status: 500 });
  }
}
