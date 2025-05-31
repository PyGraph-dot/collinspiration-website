// app/api/upload-image/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary'; // Ensure this is here

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // Authenticate and authorize the user (only admins can upload images)
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the incoming form data (which contains the file)
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    // Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary with explicit result typing
    const imageUrl: string = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'collinspiration-books',
          resource_type: 'image',
          // You can add more options here, e.g., transformations, tags
        },
        (error, result: UploadApiResponse | undefined) => { // Explicit type here
          if (result) {
            const imageUrl = result.secure_url || result.url;
            resolve(imageUrl);
          } else if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          }
        }
      ).end(buffer);
    });

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
