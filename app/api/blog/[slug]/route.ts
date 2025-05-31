import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path if needed
import { retryOperation } from "@/lib/utils"; //
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { z } from "zod";
import { revalidatePath } from 'next/cache';

// Zod schema for validating incoming blog article data when updating an article
const blogArticleUpdateSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(255).optional(),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated.").optional(),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }).optional(),
  coverImage: z.string().url({ message: "Cover image must be a valid URL." }).nullable().optional(),
  status: z.enum(["PUBLISHED", "DRAFT"], {
    errorMap: () => ({ message: "Please select a status." }),
  }).optional(),
});


// GET (Fetch a single blog article by slug)
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const article = await retryOperation(async () => {
        return await prisma.blogArticle.findUnique({
            where: { slug },
        });
    }, 3);

    if (!article) {
      return NextResponse.json({ message: "Blog article not found" }, { status: 404 });
    }
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog article:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT (Update an existing blog article by slug)
export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;
    const body = await req.json();

    const validatedData = blogArticleUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      console.error("Validation error for updating blog article:", validatedData.error.errors);
      return NextResponse.json(
        { message: "Invalid request data", errors: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const updatedArticle = await retryOperation(async () => {
        return await prisma.blogArticle.update({
            where: { slug },
            data: {
                ...validatedData.data,
            },
        });
    }, 3);

    revalidatePath(`/blog/${slug}`); // Revalidate the specific article page
    revalidatePath('/blog'); // Revalidate the blog list page
    revalidatePath('/admin/blog'); // Revalidate the admin blog list page

    return NextResponse.json(updatedArticle, { status: 200 });

  } catch (error) {
    console.error("Error updating blog article:", error);
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

// DELETE (Delete an existing blog article by slug)
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;
    console.log(`DELETE request received for blog article slug: ${slug}`);

    const existingArticle = await retryOperation(async () => {
        return await prisma.blogArticle.findUnique({ where: { slug } });
    }, 3);

    if (!existingArticle) {
      return NextResponse.json({ message: "Blog article not found" }, { status: 404 });
    }

    await retryOperation(async () => {
        await prisma.blogArticle.delete({ where: { slug } });
    }, 3);

    revalidatePath('/blog'); // Revalidate the public blog list page
    revalidatePath('/admin/blog'); // Revalidate the admin blog list page

    return NextResponse.json({ message: "Blog article deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog article:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}