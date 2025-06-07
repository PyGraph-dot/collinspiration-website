// app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Session } from "next-auth";

// Define a type for the user in the session that includes the role
interface SessionUser {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface CustomSession extends Session {
  user?: SessionUser;
}

// Handler for PUT requests to update a user
export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession;

    // 1. Check Authentication
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params; // Get the user ID from the URL parameters
    const body = await req.json();
    const { name, email } = body;

    // 2. Validate input
    if (!name && !email) {
      return NextResponse.json({ message: "No data provided for update" }, { status: 400 });
    }

    // Basic email format validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // 3. Check Authorization
    // An admin can update any user's profile.
    // A regular user can only update their own profile.
    if (session.user.role !== "ADMIN" && session.user.id !== userId) {
      return NextResponse.json({ message: "Forbidden: You can only update your own profile" }, { status: 403 });
    }

    // Prevent a non-admin user from changing their role (if role was ever part of the update)
    // Also, prevent a regular user from trying to update an email that already exists for another user.
    if (email && email !== session.user.email) {
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        return NextResponse.json({ message: "Email already taken by another user" }, { status: 409 });
      }
    }


    // 4. Perform the update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined, // Only update if provided
        email: email || undefined, // Only update if provided
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found or failed to update" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Handler for GET requests to fetch a single user (optional, but useful for display)
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession;

    // 1. Check Authentication
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    // 2. Check Authorization
    // An admin can fetch any user's profile.
    // A regular user can only fetch their own profile.
    if (session.user.role !== "ADMIN" && session.user.id !== userId) {
      return NextResponse.json({ message: "Forbidden: You can only view your own profile" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("Error fetching user:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Handler for DELETE requests (optional - for admins to delete users)
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as CustomSession;

    // 1. Check Authentication and Admin Role
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
    }

    const { userId } = params;

    // Prevent admin from deleting themselves (optional but good practice)
    if (session.user.id === userId) {
      return NextResponse.json({ message: "Forbidden: Cannot delete your own admin account" }, { status: 403 });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found or failed to delete" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting user:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
