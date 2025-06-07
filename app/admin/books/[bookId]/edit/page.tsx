// app/admin/books/[bookId]/edit/page.tsx

import { BookForm } from "@/components/admin/books/book-form";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { type Category, type Book } from "@/types/book"; // Ensure Book type is also imported

// Define the expected props type for this page component
interface EditBookPageProps {
  params: {
    bookId: string;
  };
  // If you were using searchParams, you'd define them here, e.g.:
  // searchParams?: { [key: string]: string | string[] | undefined };
}

// Use the defined interface for the component's props
export default async function EditBookPage({
  params,
}: EditBookPageProps) { // Explicitly use the interface here
  const { bookId } = params;

  // Fetch the specific book from the database using its ID
  // Explicitly type the 'book' variable to ensure compatibility with BookForm's initialData prop
  const book: Book | null = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Fetch all categories for the dropdown in the form
  const categories: Category[] = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // If no book is found with the given ID, show a 404 page
  if (!book) {
    notFound();
  }

  // Pass the fetched book data and categories to the BookForm component
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Book</h1>
      <BookForm initialData={book} categories={categories} />
    </div>
  );
}