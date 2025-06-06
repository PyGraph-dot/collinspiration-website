// lib/utils.ts
import { type ClassValue, clsx } from "clsx"; // Import clsx
import { twMerge } from "tailwind-merge"; // Import twMerge

// This is the 'cn' function that your UI components are looking for
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Your existing retryOperation function
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000 // 1 second delay
): Promise<T> {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      return await operation();
    } catch (error: unknown) { // Corrected: Changed 'any' to 'unknown'
      attempts++;
      // Safely access error message
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Safely access error code, assuming it might be on an object
      const errorCode = (error && typeof error === 'object' && 'code' in error) ? (error as { code: string }).code : undefined;

      console.warn(`Attempt ${attempts}/${maxRetries} failed: ${errorMessage}`);
      // Only retry if it's a P1001 (database connection error from Prisma) and we haven't exhausted retries
      if (errorCode === 'P1001' && attempts < maxRetries) {
        console.log(`Retrying after ${delayMs}ms due to database connection error...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        // Re-throw if it's not a P1001 error or max retries are reached
        throw error;
      }
    }
  }
  // This line should technically not be reached if maxRetries > 0 and errors are handled
  throw new Error("Max retries reached, operation failed due to persistent issues.");
}
