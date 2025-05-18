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
        const data = await response.json()

        if (data.length > 0) {
          setFeaturedPost(data[0])
          setRecentPosts(data.slice(1, 4)) // Get next 3 posts
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Fallback blog posts in case API fails
  const fallbackPosts = [
    {
      id: "1",
      title: "The Power of Daily Reading: Transform Your English in Just 20 Minutes a Day",
      slug: "power-of-daily-reading",
      excerpt:
        "Discover how establishing a consistent daily reading habit can dramatically improve your vocabulary, comprehension, and overall English proficiency.",
      content: "Full content here...",
      coverImage: "/images/blog/daily-reading.jpg",
      category: "Reading",
      publishedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "5 Common Grammar Mistakes Even Advanced Learners Make",
      slug: "5-common-grammar-mistakes",
      excerpt:
        "Explore the subtle grammar errors that persist even among proficient English speakers, and learn practical strategies to eliminate them from your writing and speech.",
      content: "Full content here...",
      coverImage: "/images/blog/grammar-mistakes.jpg",
      category: "Grammar",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      title: "Building Confidence in Public Speaking: A Step-by-Step Approach",
      slug: "building-confidence-public-speaking",
      excerpt:
        "Learn practical techniques to overcome anxiety and develop poise when speaking English in public settings, from classroom presentations to professional conferences.",
      content: "Full content here...",
      coverImage: "/images/blog/public-speaking.jpg",
      category: "Speaking",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "4",
      title: "Advanced Literary Analysis Techniques for English Learners",
      slug: "advanced-literary-analysis",
      excerpt:
        "Discover how to analyze English literature like a professional critic, enhancing your understanding and appreciation of classic and contemporary works.",
      content: "Full content here...",
      coverImage: "/images/blog/literary-analysis.jpg",
      category: "Literature",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ]

  // Use fallback posts if API returns empty array
  const displayFeaturedPost = featuredPost || fallbackPosts[0]
  const displayRecentPosts = recentPosts.length > 0 ? recentPosts : fallbackPosts.slice(1)

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

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">English Learning Blog</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Explore our collection of articles, tips, and insights to enhance your English language journey.
          </p>
        </div>

        {displayFeaturedPost && (
          <div className="bg-white rounded shadow-lg overflow-hidden mb-12 transition-transform hover:-translate-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto overflow-hidden">
                <Image
                  src={displayFeaturedPost.coverImage || "/images/placeholder-blog.jpg"}
                  alt={displayFeaturedPost.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="text-primary font-semibold text-sm mb-2">{displayFeaturedPost.category}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{displayFeaturedPost.title}</h3>
                <p className="text-gray-700 mb-6">{displayFeaturedPost.excerpt}</p>
                <div>
                  <Link
                    href={`/blog/${displayFeaturedPost.slug}`}
                    className="text-primary font-semibold flex items-center hover:underline"
                  >
                    Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {displayRecentPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayRecentPosts.map((post) => (
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
