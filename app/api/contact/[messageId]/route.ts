// app/api/contact/[messageId]/route.ts
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

// Zod schema for updating a contact message
// Currently, no fields are explicitly defined for update.
// If you want to update fields like 'isRead' or 'adminNotes',
// you would add them here and also to your Prisma schema.
const ContactMessageUpdateSchema = z.object({
  // Example if you add an 'isRead' field to your Prisma model:
  // isRead: z.boolean().optional(),
  // Example if you add an 'adminNotes' field to your Prisma model:
  // adminNotes: z.string().optional().nullable(),
});

// GET handler for a single contact message by ID
export async function GET(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    // --- Authorization Check for Admin Access ---
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // --- End Authorization Check ---

    const { messageId } = params;

    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(message, { status: 200 });

  } catch (error) {
    console.error(`Error fetching message with ID ${params.messageId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a contact message by ID
export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    // --- Authorization Check for Admin Access ---
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // --- End Authorization Check ---

    const { messageId } = params;

    const deletedMessage = await prisma.contactMessage.delete({
      where: { id: messageId },
    });

    if (!deletedMessage) {
      return NextResponse.json({ message: "Message not found or failed to delete" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting message with ID ${params.messageId}:`, error);
    if ((error as any).code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ message: "Message not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT handler for updating a contact message by ID
export async function PUT(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = params;
    const body = await req.json();

    const parsed = ContactMessageUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Check if there's any data to update; if not, return 400 or just the existing message
    if (Object.keys(data).length === 0) {
        return NextResponse.json({ message: "No data provided for update." }, { status: 400 });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: messageId },
      data: data, // Use 'data' from parsed zod schema
    });

    if (!updatedMessage) {
      return NextResponse.json({ message: "Message not found or failed to update" }, { status: 404 });
    }

    return NextResponse.json(updatedMessage, { status: 200 });

  } catch (error) {
    console.error(`Error updating message with ID ${params.messageId}:`, error);
    if ((error as any).code === 'P2025') { // Record not found
      return NextResponse.json({ message: "Message not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
