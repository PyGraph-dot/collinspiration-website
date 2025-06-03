// app/api/books/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from 'next/cache';
import type { Session } from "next-auth"; // Import Session type

// Define a type for the user in the session that includes the role
interface SessionUser {
  id: string; // Assuming user has an ID
  email: string; // Assuming user has an email
  role: "ADMIN" | "USER"; // Define possible roles
  // Add other properties if your session user object has them
}

// Extend the Session type to include the custom user type
interface CustomSession extends Session {
  user?: SessionUser;
}

// --- CORRECTED ZOD SCHEMA FOR UPDATES ---
const bookUpdateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(255).optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).optional(),
  coverImage: z.string().url("Invalid cover image URL").nullable().optional(),
  price: z.number().positive({ message: "Price must be a positive number." }).optional(),
  categoryId: z.string().min(1, { message: "Category ID must be provided if updated." }).optional(),
  type: z.enum(["MY_BOOK", "AFFILIATE"], { errorMap: () => ({ message: "Please select a book type." }) }).optional(), // CORRECTED: Uppercase enum values
  amazonLink: z.union([z.string().url("Invalid Amazon link URL"), z.literal('')]).transform(e => e === '' ? null : e).nullable().optional(),
  nigerianLink: z.union([z.string().url("Invalid Nigerian link URL"), z.literal('')]).transform(e => e === '' ? null : e).nullable().optional(),
  status: z.enum(["PUBLISHED", "DRAFT"], { errorMap: () => ({ message: "Please select a status." }) }).optional(), // CORRECTED: Uppercase enum values
});
// --- END OF CORRECTED ZOD SCHEMA ---

// --- GET (Fetch a single book by ID) ---
export async function GET(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession; // <--- CORRECTED: Cast session to CustomSession
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = params;

    if (!bookId) {
      return NextResponse.json({ message: "Book ID is required" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { category: true },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- PUT (Update a book by ID) ---
export async function PUT(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession; // <--- CORRECTED: Cast session to CustomSession
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = params;
    if (!bookId) {
      return NextResponse.json({ message: "Book ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = bookUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error.errors);
      return NextResponse.json(
        { message: "Invalid request data", errors: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { categoryId, ...bookUpdateData } = validatedData.data;

    const dataForPrisma = {
      ...bookUpdateData,
      ...(categoryId !== undefined && { category: { connect: { id: categoryId } } }),
    };

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: dataForPrisma,
    });

    revalidatePath(`/admin/books/${bookId}`);
    revalidatePath('/admin/books');
    revalidatePath('/');

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- DELETE (Delete a book by ID) ---
export async function DELETE(
  req: NextRequest,
  // { params }: { params: { bookId: string } } // <--- REMOVED: params is not used directly here
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession; // <--- CORRECTED: Cast session to CustomSession

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const bookId = url.pathname.split('/').pop();

    console.log('DELETE request received for bookId (from URL parse):', bookId);

    if (!bookId) {
      console.log('Book ID is missing or empty after URL parse, returning 400.');
      return NextResponse.json({ message: "Book ID is required" }, { status: 400 });
    }

    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
    });

    console.log('Existing book found:', existingBook ? 'Yes' : 'No');

    if (!existingBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    await prisma.book.delete({
      where: { id: bookId },
    });

    revalidatePath('/admin/books');
    revalidatePath('/');

    return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
