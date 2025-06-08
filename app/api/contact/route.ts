// app/api/contact/route.ts
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


// Zod schema for validating incoming contact form data
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  // Assuming 'subscribe' checkbox is optional and not stored in DB directly for this model,
  // or you'd handle it separately (e.g., newsletter subscription).
});

// Handler for POST requests (submitting the contact form)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the incoming data against the schema
    const parsed = ContactFormSchema.safeParse(body);

    if (!parsed.success) {
      // If validation fails, return a 400 Bad Request with error details
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Save the contact message to the database using Prisma
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // Return a success response
    return NextResponse.json(
      { message: "Message sent successfully!", data: newMessage },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error("Error sending contact message:", error);
    // Return a generic 500 Internal Server Error for unexpected issues
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handler for GET requests (fetching all contact messages - typically for admin)
export async function GET() {
  try {
    // --- Authorization Check for Admin Access ---
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // --- End Authorization Check ---

    // Fetch all contact messages from the database
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc', // Order by newest first
      },
    });

    // Return the messages
    return NextResponse.json(messages, { status: 200 });

  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
