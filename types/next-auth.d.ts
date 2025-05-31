// types/next-auth.d.ts (or wherever your next-auth.d.ts is located)
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@prisma/client"; // <--- IMPORTANT: Ensure this path is correct for your Prisma client

// Extend the default NextAuth session and user types
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Your custom 'id'
      role: Role; // Your custom 'role' as Prisma enum
      name?: string | null; // Allow string, null, or undefined
      email?: string | null; // Allow string, null, or undefined
    } & DefaultSession["user"]; // Merge with default session user properties
  }

  interface User extends DefaultUser {
    id: string; // Your custom 'id'
    role: Role; // Your custom 'role' as Prisma enum
    name?: string | null; // Allow string, null, or undefined
    email?: string | null; // Allow string, null, or undefined
    // Add any other custom properties from your Prisma User model that are returned by authorize
  }
}

// Extend the JWT type for consistency
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    // CRUCIAL: Make these optional (`?`) AND allow `null` for consistency with how JWTs might be populated
    email?: string | null;
    name?: string | null;
    role: Role; // Ensure this is your Prisma Role enum
    // Add any other custom properties you put into the JWT
  }
}