// app/api/categories/[categoryId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Session } from "next-auth";

// Define a type for the user in the session that includes the role
interface SessionUser {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface CustomSession extends Session {
  user?: SessionUser;
}

// Zod schema for category update (name and description can be optional)
const CategoryUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(), // Name is optional for update, but if present, must be at least 1 char
  description: z.string().optional().nullable(), // Description can be optional and nullable
  status: z.string().optional(), // Status can be updated
});

// GET handler for a single category by ID
export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    // You might want to add authentication/authorization here
    // For now, allowing public read for individual categories if not strictly admin-only
    // const session = await getServerSession(authOptions) as CustomSession;
    // if (!session || !session.user || session.user.role !== "ADMIN") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { categoryId } = params;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });

  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}


// PUT handler to update a category by ID
export async function PUT(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession;

    // Ensure only authenticated admins can update categories
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { categoryId } = params;
    const body = await req.json();

    // Zod validation for update
    const parsed = CategoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Check if the new name (if provided) conflicts with an existing category name
    if (data.name) {
      const existingCategory = await prisma.category.findUnique({
        where: { name: data.name },
      });
      if (existingCategory && existingCategory.id !== categoryId) {
        return NextResponse.json({ message: "Category name already exists" }, { status: 409 });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
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

    if (!updatedCategory) {
      return NextResponse.json({ message: "Category not found or failed to update" }, { status: 404 });
    }

    return NextResponse.json(updatedCategory, { status: 200 });

  } catch (error) {
    console.error("Error updating category:", error);
    // Handle specific Prisma errors like not found or unique constraint
    if ((error as any).code === 'P2025') { // Record not found
      return NextResponse.json({ message: "Category not found." }, { status: 404 });
    }
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('name')) {
      return NextResponse.json({ message: "Category with this name already exists." }, { status: 409 });
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a category by ID
export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession;

    // Ensure only authenticated admins can delete categories
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { categoryId } = params;

    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    if (!deletedCategory) {
      return NextResponse.json({ message: "Category not found or failed to delete" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting category:", error);
    if ((error as any).code === 'P2025') { // Record not found
      return NextResponse.json({ message: "Category not found." }, { status: 404 });
    }
    // Handle cases where category might have related records (e.g., books) if onDelete is not Cascade
    // This typically results in a foreign key constraint error (e.g., P2003 for PostgreSQL)
    if ((error as any).code === 'P2003') {
        return NextResponse.json({ message: "Cannot delete category with associated books. Please reassign or delete books first." }, { status: 409 });
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
