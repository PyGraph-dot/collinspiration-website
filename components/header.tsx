"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Collinspiration" width={180} height={50} className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="font-medium text-gray-800 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/#books" className="font-medium text-gray-800 hover:text-primary transition-colors">
            Books
          </Link>
          <Link href="/#about" className="font-medium text-gray-800 hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/#testimonials" className="font-medium text-gray-800 hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Link href="/#blog" className="font-medium text-gray-800 hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/#contact" className="font-medium text-gray-800 hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="font-medium text-gray-800 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#books"
              className="font-medium text-gray-800 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Books
            </Link>
            <Link
              href="/#about"
              className="font-medium text-gray-800 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/#testimonials"
              className="font-medium text-gray-800 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/#blog"
              className="font-medium text-gray-800 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/#contact"
              className="font-medium text-gray-800 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
