import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Make sure this path is correct for your Prisma client setup

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true, // IMPORTANT: Only fetch testimonials that have been approved
      },
      orderBy: {
        createdAt: 'desc', // Order by newest first
      },
    });

    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials from database:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// OPTIONAL: Add a POST route if you want users to submit testimonials
// This would also likely require admin approval before being displayed publicly.
/*
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path if needed

const testimonialSchema = z.object({
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }).max(255),
  content: z.string().min(10, { message: "Testimonial content must be at least 10 characters." }),
  rating: z.number().int().min(1).max(5).optional().default(5),
});

export async function POST(req: Request) {
  try {
    // You might want to allow anyone to submit, or restrict to logged-in users
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();
    const validatedData = testimonialSchema.safeParse(body);

    if (!validatedData.success) {
      console.error("Validation error for new testimonial:", validatedData.error.errors);
      return NextResponse.json(
        { message: "Invalid request data", errors: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        ...validatedData.data,
        approved: false, // New testimonials are NOT approved by default
      },
    });

    // You might revalidate paths where testimonials are displayed if you want them to appear immediately
    // after admin approval (which would be a separate PATCH/PUT route for admins).
    // revalidatePath('/testimonials');

    return NextResponse.json(newTestimonial, { status: 201 });

  } catch (error) {
    console.error("Error submitting testimonial:", error);
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
*/
