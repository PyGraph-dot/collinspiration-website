// Mock data for development
export const mockBooks = [
  {
    id: 1,
    title: "English Grammar Mastery",
    description: "A comprehensive guide to mastering English grammar for all levels.",
    coverImage: "/placeholder.svg?height=400&width=300",
    price: 29.99,
    category: "Grammar",
    type: "my-book",
    amazonLink: "https://amazon.com/example-book1",
    nigerianLink: "https://example.com/nigerian-link1",
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Effective Writing Techniques",
    description: "Learn how to write clearly and effectively for academic and professional purposes.",
    coverImage: "/placeholder.svg?height=400&width=300",
    price: 24.99,
    category: "Writing",
    type: "my-book",
    amazonLink: "https://amazon.com/example-book2",
    nigerianLink: "https://example.com/nigerian-link2",
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Vocabulary Builder",
    description: "Expand your vocabulary with this comprehensive guide featuring over 5000 words.",
    coverImage: "/placeholder.svg?height=400&width=300",
    price: 19.99,
    category: "Vocabulary",
    type: "affiliate",
    amazonLink: "https://amazon.com/example-book3",
    nigerianLink: "https://example.com/nigerian-link3",
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockTestimonials = [
  {
    id: 1,
    name: "John Smith",
    title: "English Teacher",
    content: "These books have transformed my teaching approach. My students love them!",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Student",
    content: "I improved my grammar significantly after using these resources.",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockBlogPosts = [
  {
    id: 1,
    title: "5 Tips to Improve Your English Grammar",
    slug: "5-tips-improve-english-grammar",
    excerpt: "Simple tips to help you improve your English grammar skills quickly.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    coverImage: "/placeholder.svg?height=400&width=600",
    category: "Grammar",
    authorId: 1,
    status: "published",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "The Importance of Reading in Language Learning",
    slug: "importance-reading-language-learning",
    excerpt: "Why reading is crucial for developing strong language skills.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    coverImage: "/placeholder.svg?height=400&width=600",
    category: "Reading",
    authorId: 1,
    status: "published",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock user for authentication
export const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@collinspiration.com",
    // This is a hashed version of "admin123"
    password: "$2b$10$8OUrnPHLAQCGcvX5wNF6aO1TwID9S.wqGd9j8QzOGBVmRzIzlpPdm",
    role: "admin",
  },
]
