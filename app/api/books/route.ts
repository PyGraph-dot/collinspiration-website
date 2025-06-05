// app/api/books/route.ts
import { NextResponse } from "next/server";
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

// --- Zod schema for validating incoming book data when creating a new book ---
const bookSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(255),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  // For POST, coverImage is required and must be a URL
  coverImage: z.string().url({ message: "Cover image must be a valid URL." }),
  price: z.number().positive({ message: "Price must be a positive number." }),
  categoryId: z.string().min(1, { message: "Category ID is required." }),
  type: z.enum(["MY_BOOK", "AFFILIATE"], { // CORRECTED: Uppercase enum values
    errorMap: () => ({ message: "Please select a book type." }),
  }),
  amazonLink: z.string().url("Invalid Amazon link URL").nullable().optional(),
  nigerianLink: z.string().url("Invalid Nigerian link URL").nullable().optional(),
  status: z.enum(["PUBLISHED", "DRAFT"], { // CORRECTED: Uppercase enum values
    errorMap: () => ({ message: "Please select a status." }),
  }),
});

// --- Utility function for retrying operations with a delay ---
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000 // 1 second delay between retries
): Promise<T> {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      return await operation();
    } catch (error: unknown) { // <--- CORRECTED: Changed 'any' to 'unknown'
      attempts++;
      const errorMessage = (error instanceof Error) ? error.message : String(error); // Safely get error message
      const errorCode = (error && typeof error === 'object' && 'code' in error) ? (error as { code: string }).code : undefined; // Safely get error code

      console.warn(`Attempt ${attempts}/${maxRetries} failed: ${errorMessage}`);
      // Only retry if it's a P1001 (connection error) and we haven't exhausted retries
      if (errorCode === 'P1001' && attempts < maxRetries) {
        console.log(`Retrying operation after ${delayMs}ms due to database connection error...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        // Optional: Implement exponential backoff here if needed (e.g., delayMs *= 2;)
      } else {
        throw error; // Re-throw if not a P1001 error or max retries reached
      }
    }
  }
  throw new Error("Max retries reached, operation failed due to persistent issues.");
}


// --- GET (Fetch all books for public display) ---
export async function GET() {
  try {
    const books = await retryOperation(async () => {
      return await prisma.book.findMany({
        where: {
          status: "PUBLISHED", // CORRECTED: Uppercase status
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }, 3);

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error fetching all books after retries:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// --- POST (Create a new book - your existing code) ---
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession; // <--- CORRECTED: Cast session to CustomSession
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = bookSchema.safeParse(body);

    if (!validatedData.success) {
      console.error("Validation error for new book:", validatedData.error.errors);
      return NextResponse.json(
        { message: "Invalid request data", errors: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { categoryId, ...bookCreateData } = validatedData.data;

    const newBook = await prisma.book.create({
      data: {
        ...bookCreateData,
        category: {
          connect: { id: categoryId },
        },
      },
    });

    revalidatePath('/admin/books');
    revalidatePath('/');

    return NextResponse.json(newBook, { status: 201 });

  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
