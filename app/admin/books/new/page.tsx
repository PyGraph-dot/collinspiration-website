// app/admin/books/new/page.tsx
import { BookForm } from "@/components/admin/books/book-form";
import prisma from "@/lib/prisma"; // Your Prisma client instance

// Define a type for the categories you're fetching, if not already defined globally
// This helps with TypeScript type safety
interface CategoryOption {
  id: string;
  name: string;
}

export default async function AddNewBookPage() {
  // Fetch categories from the database to populate the dropdown
  // Ensure your Prisma schema has a 'Category' model
  const categories: CategoryOption[] = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Add New Book</h1>
      {/* Pass the fetched categories to the BookForm component */}
      <BookForm categories={categories} />
    </div>
  );
}
