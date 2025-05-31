"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ShoppingBag, FileText } from "lucide-react" // Changed AppleIcon to ShoppingBag
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
      <div className="container mx-auto px-4"> {/* Added mx-auto px-4 for consistent container styling */}
        <div className="text-center mb-16">
          <h2 className="section-title text-3xl font-bold mb-4">Educational Books Collection</h2>
          <p className="section-subtitle max-w-3xl mx-auto text-lg text-gray-600">
            Explore our comprehensive range of books designed to enhance your English language journey, from grammar
            fundamentals to advanced literature analysis.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"> {/* Added items-stretch */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse flex flex-col h-full"> {/* Added h-full and flex-col */}
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 flex flex-col flex-grow"> {/* Added flex-col flex-grow */}
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                </div>
                <div className="p-6 pt-0 flex gap-3 mt-auto"> {/* Added pt-0 and mt-auto */}
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"> {/* Added items-stretch */}
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 flex flex-col h-full" // Added h-full and flex-col
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
                <div className="p-6 flex flex-col flex-grow"> {/* Added flex-col flex-grow */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                  {/* Added line-clamp-4 to limit description height */}
                  <p className="text-gray-700 mb-4 line-clamp-4">{book.description}</p>
                </div>
                {/* Moved button div outside the flex-grow content div and added mt-auto */}
                <div className="p-6 pt-0 flex gap-3 mt-auto"> {/* Added pt-0 and mt-auto */}
                  <a
                    href={book.amazonLink ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-book primary-button flex-1"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Buy Hard Copy
                  </a>
                  <a
                    href={book.nigerianLink ?? ""} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-book secondary-button flex-1"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Buy Soft Copy
                  </a>
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
