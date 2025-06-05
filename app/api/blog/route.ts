// app/api/blog/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from 'next/cache';
import type { Session } from "next-auth"; // <--- IMPORTANT: This import is crucial

// --- IMPORTANT: Type definitions for custom session user and session ---
interface SessionUser {
  id: string; // Assuming user has an ID
  email: string; // Assuming user has an email
  role: "ADMIN" | "USER"; // Define possible roles
  // Add other properties if your session user object has them
}

interface CustomSession extends Session {
  user?: SessionUser;
}
// --- END IMPORTANT ---

// --- Zod schema for validating incoming blog article data when creating a new article ---
const blogArticleSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(255),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated."),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  coverImage: z.string().url({ message: "Cover image must be a valid URL." }).nullable().optional(),
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
    } catch (error: unknown) { // Use 'unknown' type for caught error
      attempts++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as any)?.code;

      console.warn(`Attempt ${attempts}/${maxRetries} failed: ${errorMessage}`);
      if (errorCode === 'P1001' && attempts < maxRetries) {
        console.log(`Retrying operation after ${delayMs}ms due to database connection error...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries reached, operation failed due to persistent issues.");
}

// --- GET (Fetch all blog articles for public display) ---
export async function GET() {
  try {
    const articles = await retryOperation(async () => {
      return await prisma.blogArticle.findMany({
        where: {
          status: "PUBLISHED", // Only fetch published articles for public display
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }, 3);

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog articles after retries:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// --- POST (Create a new blog article) ---
export async function POST(req: Request) {
  try {
    // --- IMPORTANT: Cast session to CustomSession ---
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = blogArticleSchema.safeParse(body);

    if (!validatedData.success) {
      console.error("Validation error for new blog article:", validatedData.error.errors);
      return NextResponse.json(
        { message: "Invalid request data", errors: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const newArticle = await prisma.blogArticle.create({
      data: validatedData.data,
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog'); // Revalidate the public blog list page

    return NextResponse.json(newArticle, { status: 201 });

  } catch (error) {
    console.error("Error creating blog article:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
