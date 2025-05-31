// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";
import type { Role } from "@prisma/client"; // Ensure Role is imported here too!

// Define the expected type for credentials based on your form
interface CustomCredentials {
  email?: string;
  password?: string;
  // Add any other custom fields you expect from your login form
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "a-development-secret-key",

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Session will last for 30 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as CustomCredentials;

        if (!email || !password) {
          console.log("Authorization attempt: No email or password provided.");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (!user) {
            console.log(`Authorization attempt: User not found for email: ${email}`);
            return null;
          }

          if (!user.password) {
            console.log(`Authorization attempt: User ${email} found but has no password set.`);
            return null;
          }

          const isPasswordValid = await compare(password, user.password);

          if (!isPasswordValid) {
            console.log(`Authorization attempt: Invalid password for user: ${email}`);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error during password comparison or database query:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Add user properties to the token on sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role; // Assuming user.role is of type Role from your DB
      }
      return token;
    },
    async session({ session, token }) {
      // Add token properties to the session
      if (session.user && token.role) {
        session.user.role = token.role as Role; // Explicitly cast token.role to Role
        session.user.id = token.id as string; // Explicitly cast token.id to string
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};