// @/types/book.ts

// Define the Category interface
export interface Category {
  id: string;
  name: string;
}

// Define the Book interface to match your Prisma schema and API responses
export interface Book {
  id: string;
  title: string;
  description: string;
  coverImage: string | null; // Can be null if optional
  price: number;
  categoryId: string;
  category: Category; // Assuming category is always included and has id/name
  type: 'MY_BOOK' | 'AFFILIATE'; // Corrected to uppercase literal types
  amazonLink: string | null; // Can be null if optional
  nigerianLink: string | null; // Can be null if optional
  status: 'PUBLISHED' | 'DRAFT'; // Corrected to uppercase literal types
  createdAt: Date;
  updatedAt: Date;
}