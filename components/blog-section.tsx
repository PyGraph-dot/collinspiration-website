// components/blog-section.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string
  publishedAt: string
}

export default function BlogSection() {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog")

        // Handle cases where the API route doesn't exist or returns an error
        if (!response.ok) {
          console.error(`Error fetching blog posts: ${response.status} ${response.statusText}`);
          // Set to empty/null to trigger the "No posts available" message
          setFeaturedPost(null);
          setRecentPosts([]);
          return; // Exit early if API call fails
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setFeaturedPost(data[0]);
          // Ensure there are enough posts before slicing
          setRecentPosts(data.slice(1, 4));
        } else {
          // If data is not an array or is empty, clear posts
          setFeaturedPost(null);
          setRecentPosts([]);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        // Clear posts on any other fetch error
        setFeaturedPost(null);
        setRecentPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogPosts()
  }, [])

  // Removed fallbackPosts as per your request

  // If loading, show skeletons
  if (isLoading) {
    return (
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">English Learning Blog</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Explore our collection of articles, tips, and insights to enhance your English language journey.
            </p>
          </div>

          <div className="bg-white rounded shadow-lg overflow-hidden mb-12 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-8">
                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-24 bg-gray-200 rounded mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // If not loading and no posts were fetched, show a message
  if (!featuredPost && recentPosts.length === 0) {
    return (
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">English Learning Blog</h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Explore our collection of articles, tips, and insights to enhance your English language journey.
            </p>
          </div>
          <div className="text-center py-10">
            <p className="text-gray-500">No blog posts available at the moment. Check back soon!</p>
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="btn-primary">
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // If posts are available, render them
  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">English Learning Blog</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Explore our collection of articles, tips, and insights to enhance your English language journey.
          </p>
        </div>

        {/* Render featured post only if it exists */}
        {featuredPost && (
          <div className="bg-white rounded shadow-lg overflow-hidden mb-12 transition-transform hover:-translate-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto overflow-hidden">
                <Image
                  src={featuredPost.coverImage || "/images/placeholder-blog.jpg"}
                  alt={featuredPost.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="text-primary font-semibold text-sm mb-2">{featuredPost.category}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                <p className="text-gray-700 mb-6">{featuredPost.excerpt}</p>
                <div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="text-primary font-semibold flex items-center hover:underline"
                  >
                    Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render recent posts only if there are any */}
        {recentPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded shadow-lg overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <Image
                    src={post.coverImage || "/images/placeholder-blog.jpg"}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-primary font-semibold text-sm mb-2">{post.category}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary font-semibold flex items-center hover:underline"
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/blog" className="btn-primary">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}