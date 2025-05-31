import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt" // Used for comparing hashed passwords
import { PrismaClient } from "@prisma/client" // Import Prisma Client to interact with your database

const prisma = new PrismaClient() // Initialize Prisma Client

export const authOptions: NextAuthOptions = {
  // Your secret key for NextAuth. It's crucial for security.
  // In production, this should be a strong, randomly generated string
  // stored in your environment variables (e.g., NEXTAUTH_SECRET).
  // 'a-development-secret-key' is only for development.
  secret: process.env.NEXTAUTH_SECRET || "a-development-secret-key",

  // Configure session management. 'jwt' strategy uses JSON Web Tokens.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Session will last for 30 days
  },

  // Define custom pages for NextAuth flows (e.g., sign-in, errors)
  pages: {
    signIn: "/login", // Corrected path to /login, assuming your login page is directly under /login
    error: "/login",  // Redirect to login page on authentication error
  },

  // Define authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials", // Name displayed on the login form (e.g., "Sign in with Credentials")
      credentials: {
        // Define the fields expected from the login form
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // The authorize function is where you validate the user's credentials
      async authorize(credentials) {
        // Basic validation: Check if email and password were provided
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorization attempt: No email or password provided.")
          return null // Return null to indicate authentication failure
        }

        try {
          // Query your database for the user by email using Prisma
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          // If no user is found with the provided email
          if (!user) {
            console.log(`Authorization attempt: User not found for email: ${credentials.email}`)
            return null // Authentication failed
          }

          // If the user was found but has no password (e.g., a user created via social login without a password set)
          if (!user.password) {
            console.log(`Authorization attempt: User ${credentials.email} found but has no password set.`)
            return null // Authentication failed
          }

          // Compare the provided plaintext password with the hashed password stored in the database
          const isPasswordValid = await compare(credentials.password, user.password)

          // If passwords do not match
          if (!isPasswordValid) {
            console.log(`Authorization attempt: Invalid password for user: ${credentials.email}`)
            return null // Authentication failed
          }

          // If authentication is successful, return the user object.
          // NextAuth will serialize this object into the JWT token.
          // Ensure all necessary user properties (like id, email, name, role) are returned.
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role, // Include the 'role' field, crucial for authorization checks
          }
        } catch (error) {
          console.error("Authorization error during password comparison or database query:", error)
          return null // Return null on any unexpected error during authorization
        } finally {
            // It's good practice to disconnect Prisma client in serverless environments
            // or when a connection isn't needed after a specific operation.
            // However, Next.js API routes might manage this differently.
            // For simple scripts, it's essential, but in API routes, Prisma often handles pooling.
            // If you face issues with connection pooling, you might manage this more carefully.
            await prisma.$disconnect();
        }
      },
    }),
  ],

  // Callbacks are used to modify the JWT token and session object
  callbacks: {
    // This callback is called whenever a JWT is created or updated
    async jwt({ token, user }) {
      // If a user object is available (i.e., during initial sign-in),
      // add user-specific properties to the token.
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role // Add user's role to the token
      }
      return token
    },
    // This callback is called whenever a session is accessed (e.g., by useSession())
    async session({ session, token }) {
      // If a token is available, populate the session.user object with token properties.
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string // Add user's role to the session
      }
      return session
    },
  },

  // Enable debug mode in development for more verbose logging
  debug: process.env.NODE_ENV === "development",
}