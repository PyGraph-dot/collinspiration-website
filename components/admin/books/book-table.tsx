// components/admin/books/book-table.tsx
"use client"

import { useState, useEffect, useCallback } from "react" // Added useCallback
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Filter, ChevronDown, Search } from "lucide-react"
import type { Book } from "@/types/book" // Assuming this type correctly reflects Prisma schema
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation" // Import useRouter

export default function BookTable() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter() // Initialize useRouter

  // Function to fetch books, now wrapped in useCallback to stabilize its reference
  // or, more simply, define it directly inside useEffect if it's only used there.
  // For this case, defining it inside useEffect is cleaner.
  useEffect(() => {
    const fetchBooks = async () => { // Moved fetchBooks inside useEffect
      try {
        setIsLoading(true)
        const response = await fetch("/api/books")
        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }
        const data = await response.json()
        if (Array.isArray(data)) {
          setBooks(data)
        } else {
          console.error("Fetched data is not an array:", data)
          setBooks([])
        }
      } catch (error) {
        console.error("Error fetching books:", error)
        setBooks([])
        toast({
          title: "Error",
          description: "Failed to fetch books. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [toast, router]) // Now fetchBooks is not a dependency, as it's defined inside.
                     // toast and router are still dependencies as they are used inside fetchBooks.

  const handleDelete = async (id: string) => {
    // IMPORTANT: Replace window.confirm with a custom modal UI as window.confirm is not supported in Canvas.
    // For now, keeping it as is, but be aware it won't show in the Canvas preview.
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setBooks(books.filter((book) => book.id !== id))
          toast({
            title: "Success",
            description: "Book deleted successfully.",
          })
        } else {
          throw new Error("Failed to delete book")
        }
      } catch (error) {
        console.error("Error deleting book:", error)
        toast({
          title: "Error",
          description: "Failed to delete book. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Bulk Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Publish Selected</DropdownMenuItem>
              <DropdownMenuItem>Unpublish Selected</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete Selected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-3 flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Books</DropdownMenuItem>
              <DropdownMenuItem>Published</DropdownMenuItem>
              <DropdownMenuItem>Drafts</DropdownMenuItem>
              <DropdownMenuItem>My Books</DropdownMenuItem>
              <DropdownMenuItem>Affiliate Books</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-64"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cover
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title / Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-16 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden">
                        <Image
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          width={48}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 mb-1">{book.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{book.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          // CORRECTED: Compare with uppercase enum values
                          book.type === "MY_BOOK" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {/* CORRECTED: Display based on uppercase enum values */}
                        {book.type === "MY_BOOK" ? "My Book" : "Affiliate"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${book.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          // CORRECTED: Compare with uppercase enum values
                          book.status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {/* CORRECTED: Display based on uppercase enum values */}
                        {book.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/books/${book.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing 1 to {filteredBooks.length} of {filteredBooks.length} entries
        </div>
        <div className="flex">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="ml-2 bg-primary text-white">
            1
          </Button>
          <Button variant="outline" size="sm" className="ml-2" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
