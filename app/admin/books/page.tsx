import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookTable from "@/components/admin/books/book-table"

export default function BooksPage() {
  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Book Management</h1>
          <p className="text-gray-600">Manage your books and affiliate products in one place</p>
        </div>
        <Link href="/admin/books/new" className="mt-4 md:mt-0">
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      <BookTable />
    </div>
  )
}
