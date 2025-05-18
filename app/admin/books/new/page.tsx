import BookForm from "@/components/admin/books/book-form"

export default function NewBookPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Add New Book</h1>
        <p className="text-gray-600">Create a new book to showcase on your website</p>
      </div>

      <BookForm />
    </div>
  )
}
