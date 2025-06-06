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
  price: z.coerce.number().positive({ message: "Price must be a positive number." }), // Ensure robust number conversion
  categoryId: z.string().min(1, { message: "Category ID is required." }),
  type: z.enum(["MY_BOOK", "AFFILIATE"], { // Corrected to uppercase
    errorMap: () => ({ message: "Please select a book type." }),
  }),
  amazonLink: z.string().url("Invalid Amazon link URL").nullable().optional(),
  nigerianLink: z.string().url("Invalid Nigerian link URL").nullable().optional(),
  status: z.enum(["PUBLISHED", "DRAFT"], { // Corrected to uppercase
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
    } catch (error: unknown) {
      attempts++;
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      const errorCode = (error && typeof error === 'object' && 'code' in error) ? (error as { code: string }).code : undefined;

      console.warn(`Attempt ${attempts}/${maxRetries} failed: ${errorMessage}`);
      // Only retry if it's a P1001 (connection error) and we haven't exhausted retries
      if (errorCode === 'P1001' && attempts < maxRetries) {
        console.log(`Retrying operation after ${delayMs}ms due to database connection error...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
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
    console.log("API: GET /api/books called."); // ADDED LOG
    const books = await retryOperation(async () => {
      return await prisma.book.findMany({
        where: {
          status: "PUBLISHED", // Corrected: Uppercase status
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
    console.log(`API: Found ${books.length} published books.`); // ADDED LOG
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error fetching all books after retries:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// --- POST (Create a new book) ---
export async function POST(req: Request) {
  try {
    console.log("API: POST /api/books called to create a new book."); // ADDED LOG
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") {
      console.warn("API: Unauthorized attempt to create book. Session or role invalid."); // ADDED LOG
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log("API: User is authorized as ADMIN."); // ADDED LOG

    const body = await req.json();
    console.log("API: Received request body:", body); // ADDED LOG
    const validatedData = bookSchema.safeParse(body);

    if (!validatedData.success) {
      console.error("API: Validation error for new book:", validatedData.error.errors); // ADDED LOG
      return NextResponse.json(
        { message: "Invalid request data", errors: validatedData.error.flatten() },
        { status: 400 }
      );
    }
    console.log("API: Data validation successful. Validated data:", validatedData.data); // ADDED LOG

    const { categoryId, ...bookCreateData } = validatedData.data;

    const newBook = await prisma.book.create({
      data: {
        ...bookCreateData,
        category: {
          connect: { id: categoryId },
        },
      },
    });
    console.log("API: Book created successfully:", newBook.id); // ADDED LOG

    revalidatePath('/admin/books');
    revalidatePath('/');
    console.log("API: Paths revalidated."); // ADDED LOG

    return NextResponse.json(newBook, { status: 201 });

  } catch (error) {
    console.error("API: Error creating book in catch block:", error); // ADDED LOG
    // Check if error is a PrismaClientKnownRequestError for more specific details
    if (error instanceof Error && 'code' in error && typeof error.code === 'string') {
        console.error("Prisma Error Code:", error.code);
        console.error("Prisma Error Message:", error.message);
        // You can add more specific handling based on error.code here if needed
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
