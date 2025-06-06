// app/api/stats/books/route.ts
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

export async function GET() {
  try {
    // Ensure only authenticated admins can access this stat
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const totalBooks = await prisma.book.count();

    return NextResponse.json({ count: totalBooks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching total books count:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
