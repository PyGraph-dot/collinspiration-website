"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AppleIcon as Amazon, FileText } from "lucide-react"
import type { Book } from "@/types/book"

export default function BooksSection() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books")
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return (
    <section id="books" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">Educational Books Collection</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Explore our comprehensive range of books designed to enhance your English language journey, from grammar
            fundamentals to advanced literature analysis.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded shadow-lg overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div className="h-64 overflow-hidden">
                  <Image
                    src={book.coverImage || "/placeholder.svg"}
                    alt={book.title}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-700 mb-4">{book.description}</p>
                  <div className="flex gap-3">
                    <a
                      href={book.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-book primary-button flex-1"
                    >
                      <Amazon className="mr-2 h-4 w-4" /> Buy Hard Copy
                    </a>
                    <a
                      href={book.nigerianLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-book secondary-button flex-1"
                    >
                      <FileText className="mr-2 h-4 w-4" /> Buy Soft Copy
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No books available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  )
}
