// types/next-auth.d.ts
// This file extends the types for next-auth to include custom properties like 'role'.
// It allows TypeScript to understand the structure of the session and JWT.

import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Define the Role enum from your Prisma schema here for consistency
declare module "@prisma/client" {
  export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
  }
}

// Extend the built-in NextAuth types
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string; // Add user id
      role: "ADMIN" | "USER"; // Add custom role property
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object that is returned from the provider.
   */
  interface User extends DefaultUser {
    id: string; // Ensure id is present
    role: "ADMIN" | "USER"; // Add custom role property
  }
}

// Extend the built-in NextAuth JWT types
declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT extends DefaultJWT {
    id: string; // Add user id
    role: "ADMIN" | "USER"; // Add custom role property
  }
}
