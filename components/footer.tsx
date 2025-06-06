"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
// Removed TikTok from lucide-react import as it's not available
import { Facebook, Instagram, Twitter, Youtube, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: data.message,
        })
        setEmail("")
      } else {
        throw new Error(data.error || "Something went wrong")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image src="/logo-white.png" alt="Collinspiration" width={180} height={50} className="h-10 w-auto" />
            </Link>
            <p className="text-gray-400 mb-6">
              Transforming English education through literature and innovative teaching methodologies since 2017.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/collinspire"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full text-white hover:bg-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/collinspiration1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full text-white hover:bg-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.twitter.com/wokochituru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full text-white hover:bg-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.youtube.com/@collinspiration"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full text-white hover:bg-primary transition-colors"
              >
                <Youtube size={20} />
              </a>
              {/* NEW: TikTok Link - Using inline SVG for TikTok logo */}
              <a
                href="https://www.tiktok.com/@collinspiration"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full text-white hover:bg-primary transition-colors"
              >
                {/* Inline SVG for TikTok logo - ensures it renders without lucide-react dependency */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-tiktok" // Keeping lucide class for styling consistency
                >
                  <path d="M9 12h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 1-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h2V9a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 1-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h2V9a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 1-2-2H9zM19 3h-2V1h-2v2H3v2h2v6H3v2h2v6H3v2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v-2h-2V9h-2v2h-2V9h-2V7h-2V5h-2V3zm-2 2h-2V3h2v2zM5 5h2V3H5v2zM5 19v-2h2v2H5zm0-4v-2h2v2H5zm0-4v-2h2v2H5zm0-4V5h2v2H5zm4 10v-2h2v2H9zm0-4v-2h2v2H9zm0-4v-2h2v2H9zm0-4V5h2v2H9zm4 10v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4V5h2v2h-2zm4 10v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4V5h2v2h-2z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#books" className="text-gray-400 hover:text-white transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates on new books, articles, and exclusive content.
            </p>
            <form className="mb-4" onSubmit={handleSubscribe}>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 border-0 text-white rounded-r-none focus-visible:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button type="submit" className="rounded-l-none" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                </Button>
              </div>
            </form>
            <p className="text-gray-500 text-sm">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Collinspiration. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
