import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path if needed
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { z } from "zod";
import { revalidatePath } from 'next/cache';
import { retryOperation } from "@/lib/utils"; 

// Zod schema for validating incoming blog article data when creating a new article
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
  status: z.enum(["PUBLISHED", "DRAFT"], {
    errorMap: () => ({ message: "Please select a status." }),
  }),
});


// GET (Fetch all published blog articles)
export async function GET() {
  try {
    // Apply retry logic for fetching blog articles
    const articles = await retryOperation(async () => {
      return await prisma.blogArticle.findMany({
        where: {
          status: "PUBLISHED", // Only fetch published articles for public display
        },
        orderBy: {
          createdAt: 'desc', // Newest articles first
        },
      });
    }, 3); // Retry 3 times

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog articles after retries:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST (Create a new blog article - assuming only admins can create)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
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

    const newArticle = await retryOperation(async () => {
        return await prisma.blogArticle.create({
            data: {
                ...validatedData.data,
            },
        });
    }, 3);

    revalidatePath('/blog'); // Revalidate the public blog list page
    revalidatePath('/admin/blog'); // Revalidate the admin blog list page

    return NextResponse.json(newArticle, { status: 201 });

  } catch (error) {
    console.error("Error creating blog article:", error);
    if (error instanceof z.ZodError) {
        return NextResponse.json(
            { message: "Validation failed", errors: error.flatten() },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}