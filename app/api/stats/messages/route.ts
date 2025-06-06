// app/api/stats/messages/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sql } from '@vercel/postgres'; // Using @vercel/postgres for consistency with contact route
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

    // Fetch the count of messages from the 'contact_messages' table
    const result = await sql`
      SELECT COUNT(*) FROM contact_messages;
    `;

    // The count is returned as a string in the 'count' property of the first row
    const totalMessages = parseInt(result.rows[0].count, 10);

    return NextResponse.json({ count: totalMessages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching total messages count:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
