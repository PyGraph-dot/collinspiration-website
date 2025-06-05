// app/api/upload-image/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary SDK
import type { Session } from "next-auth"; // <--- ADDED: Import Session type

// --- ADDED: Type definitions for custom session user and session ---
interface SessionUser {
  id: string; // Assuming user has an ID
  email: string; // Assuming user has an email
  role: "ADMIN" | "USER"; // Define possible roles
  // Add other properties if your session user object has them
}

interface CustomSession extends Session {
  user?: SessionUser;
}
// --- END ADDED ---

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // Authenticate and authorize the user (only admins can upload images)
    // --- CORRECTED: Cast session to CustomSession ---
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || session.user.role !== "ADMIN") { // <--- CORRECTED: Removed 'as any'
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the incoming form data (which contains the file)
    const formData = await req.formData();
    const file = formData.get('file') as File; // 'file' should match the FormData key from the client

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    // Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    // Use a Promise to handle the Cloudinary upload stream
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'collinspiration-books', // Optional: specify a folder in your Cloudinary account
          resource_type: 'image', // Ensure it's treated as an image
          // You can add more options here, e.g., transformations, tags
        },
        (error, uploadResult) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          resolve(uploadResult);
        }
      ).end(buffer); // End the stream with the image buffer
    });

    // @ts-ignore - result is guaranteed to have url if successful
    const imageUrl = (result as any).secure_url || (result as any).url; // Get the secure URL of the uploaded image

    if (!imageUrl) {
      throw new Error("Cloudinary did not return a valid image URL.");
    }

    return NextResponse.json({ imageUrl }, { status: 200 });

  } catch (error) {
    console.error("Error in /api/upload-image:", error);
    return NextResponse.json(
      { message: "Failed to upload image", error: (error as Error).message },
      { status: 500 }
    );
  }
}
