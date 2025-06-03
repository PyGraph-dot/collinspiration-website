// app/admin/books/[bookId]/edit/page.tsx

import { BookForm } from "@/components/admin/books/book-form";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { type Category } from "@/types/book";
// Removed: import type { PageProps } from 'next'; // This import was causing the error

// Removed: interface EditBookPageProps extends PageProps<{ bookId: string }> {}
// Instead, we will define the params type directly in the function signature.

export default async function EditBookPage({
  params, // Destructure params directly
}: {
  // Define the type for params inline here
  params: {
    bookId: string;
  };
  // If this page component were to accept searchParams, you would define them here:
  // searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { bookId } = params;

  // Fetch the specific book from the database using its ID
  const book = await prisma.book.findUnique({
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
