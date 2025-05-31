// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Declare a global variable for PrismaClient in a way that TypeScript understands
// This prevents creating multiple instances of PrismaClient in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// Check if we are in a production environment
if (process.env.NODE_ENV === 'production') {
  // In production, always create a new instance
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to reuse the instance
  // This avoids hot-reloading creating new instances and exhausting the connection pool
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;