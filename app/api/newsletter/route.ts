// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import your Prisma client
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Your NextAuth configuration
import type { Session } from "next-auth";

// Define a type for the user in the session that includes the role (for auth)
interface SessionUser {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface CustomSession extends Session {
  user?: SessionUser;
}

// Zod schema for newsletter subscription
const NewsletterSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
});

// Handler for POST requests (submitting the newsletter form)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the incoming data against the schema
    const parsed = NewsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please check the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { email } = parsed.data;

    // Use Prisma to check if email already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        {
          success: true,
          message: "You're already subscribed to our newsletter!",
        },
        { status: 200 }
      );
    }

    // Use Prisma to add new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: email,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing to our newsletter!",
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("Error subscribing to newsletter:", error);
    let errorMessage = "Failed to subscribe. Please try again.";

    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
        errorMessage = "This email is already subscribed.";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 409 }
        );
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Handler for GET requests (fetching all newsletter subscribers - typically for admin)
export async function GET() {
  try {
    // --- Authorization Check for Admin Access ---
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // --- End Authorization Check ---

    // Fetch all newsletter subscribers from the database
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        subscribedAt: 'desc', // Order by newest subscriptions first
      },
      select: { // Select only necessary fields
        id: true,
        email: true,
        subscribedAt: true,
      }
    });

    // Return the subscribers
    return NextResponse.json(subscribers, { status: 200 });

  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
