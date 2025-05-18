"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star, StarHalf } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  title: string
  content: string
  avatar: string | null
  rating: number
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials")
        const data = await response.json()
        setTestimonials(data)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Fallback testimonials in case API fails
  const fallbackTestimonials = [
    {
      id: "1",
      name: "Emily Richardson",
      title: "Graduate Student, University of Edinburgh",
      content:
        'Professor Collins\' "Advanced Composition Techniques" completely transformed my academic writing. I went from struggling with essays to receiving consistent A grades in my university courses. His clear explanations and practical examples made complex concepts accessible.',
      avatar: "/images/testimonials/emily.jpg",
      rating: 5,
    },
    {
      id: "2",
      name: "Hiroshi Tanaka",
      title: "Business Professional, Tokyo",
      content:
        'As a non-native English speaker, I found "The Art of English Grammar" to be an invaluable resource. The systematic approach and abundant exercises helped me improve my grammar skills significantly. I now feel confident in both my written and spoken English.',
      avatar: "/images/testimonials/hiroshi.jpg",
      rating: 5,
    },
    {
      id: "3",
      name: "Sarah Johnson",
      title: "English Department Head, Boston Academy",
      content:
        "I've been teaching English for over 15 years, and Mr. Collins' books are by far the best resources I've found. \"Literary Analysis for Students\" has become essential in my classroom, providing students with the tools they need to engage deeply with literature.",
      avatar: "/images/testimonials/sarah.jpg",
      rating: 5,
    },
    {
      id: "4",
      name: "Raj Patel",
      title: "Computer Science Student, MIT",
      content:
        'Mr. Collins\' "Technical Writing for STEM" helped me improve my documentation skills tremendously. As a computer science student, I struggled with clearly explaining complex concepts, but this book provided practical strategies that I use daily.',
      avatar: "/images/testimonials/raj.jpg",
      rating: 4.5,
    },
    {
      id: "5",
      name: "Fatimah Al-Zahra",
      title: "ESL Teacher, International School of Dubai",
      content:
        "I recommend Mr. Collins' books to all my ESL students. The clear structure and progressive difficulty make them perfect for learners at various levels. The cultural sensitivity in his examples is also greatly appreciated.",
      avatar: "/images/testimonials/fatimah.jpg",
      rating: 5,
    },
    {
      id: "6",
      name: "Marcus Williams",
      title: "Journalism Major, Columbia University",
      content:
        'The practical exercises in "Effective Communication" helped me develop a more engaging writing style. I\'ve applied these techniques to my journalism assignments and received excellent feedback from my professors.',
      avatar: "/images/testimonials/marcus.jpg",
      rating: 4.5,
    },
  ]

  // Use fallback testimonials if API returns empty array
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials

  return (
    <section id="testimonials" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">Student Testimonials</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Hear from students and readers who have transformed their English skills through Mr. Collins' educational
            books and teaching methods.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded shadow-lg p-8 animate-pulse">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-amber-200 rounded-full mr-1"></div>
                  ))}
                </div>
                <div className="h-24 bg-gray-200 rounded mb-6"></div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded shadow-lg p-8 transition-transform hover:-translate-y-1"
              >
                <div className="flex text-amber-400 mb-4">
                  {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                    <Star key={i} className="fill-current" size={18} />
                  ))}
                  {testimonial.rating % 1 !== 0 && <StarHalf className="fill-current" size={18} />}
                  <span className="ml-1 text-gray-500 text-sm">{testimonial.rating}</span>
                </div>
                <p className="text-gray-700 mb-6 italic">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/images/placeholder-avatar.jpg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
