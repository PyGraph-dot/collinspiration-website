// lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs"; // Import compare for password checking
import prisma from "@/lib/prisma"; // Your Prisma client instance
import { type Adapter } from "next-auth/adapters"; // Import Adapter type

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter, // Cast PrismaAdapter to Adapter
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // Return null if no credentials
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null; // Return null if user not found or password doesn't match
        }

        // Return user object, which NextAuth will serialize.
        // Ensure the returned user matches the extended `User` type.
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Include the role
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Assuming user.role is of type Role from your DB
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // Ensure role is propagated to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Specify your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure NEXTAUTH_SECRET is set in .env
};
