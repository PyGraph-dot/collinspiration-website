"use client"

import { useEffect, useState } from "react"
import { Star, StarHalf } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  title: string
  content: string
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

  // Fallback testimonials in case API fails or returns empty array
  const fallbackTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Chubi Dagger",
      title: "Unknown",
      content:
        'Learning a lot from you bro. Keep up the good work. I am a Nigerian and I am currently in the university studying English and Literary Studies. I have been following your lessons for a while now, and I must say, they are incredibly helpful. Your explanations are clear and concise, making it easy to understand even the most complex topics. Thank you for your dedication to teaching!',
      rating: 5,
    },
    {
      id: "2",
      name: "Arthur Nicholas",
      title: "Business Professional, Tokyo",
      content:
        'I wish I had an English teacher like u wayback in school',
      rating: 5,
    },
    {
      id: "3",
      name: "Olaiya Jembola",
      title: "Nill",
      content:
        "You are just a good English teacher. I have been following your lessons for a while now, and I must say, they are incredibly helpful. Your explanations are clear and concise, making it easy to understand even the most complex topics. Thank you for your dedication to teaching!",
      rating: 5,
    },
    {
      id: "4",
      name: "Eli Gogo UcheAwaji Bara",
      title: "NIl",
      content:
        'Thanks, great teacher I learnt a lot from you as an English student.',
      rating: 4.5,
    },
    {
      id: "5",
      name: "Unknown",
      title: "Unknown",
      content:
        "You are really doing a good work. thanks so much....on behalf of our future generations.",
      rating: 5,
    },
    {
      id: "6",
      name: "Mish",
      title: "Unknown",
      content:
        'I love your content! Your videos on grammar and writing techniques have been incredibly helpful for my studies. I especially appreciate how you break down complex topics into easy-to-understand lessons. Keep up the great work!',
      rating: 4.5,
    },
  ]

  // Use fallback testimonials if API returns empty array, otherwise use fetched testimonials
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials

  // Helper to get initials for avatar placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2); // Get max 2 initials
  };

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4"> {/* Added mx-auto px-4 for consistent container styling */}
        <div className="text-center mb-16">
          <h2 className="section-title text-3xl font-bold mb-4">Student Testimonials</h2>
          <p className="section-subtitle max-w-3xl mx-auto text-lg text-gray-600">
            Hear from students and readers who have transformed their English skills through Mr. Collins' educational
            books and teaching methods.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"> {/* Added items-stretch */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 animate-pulse flex flex-col h-full"> {/* Added h-full and flex-col */}
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-amber-200 rounded-full mr-1"></div>
                  ))}
                </div>
                <div className="h-24 bg-gray-200 rounded mb-6 flex-grow"></div> {/* Added flex-grow */}
                <div className="flex items-center mt-auto"> {/* Added mt-auto */}
                  {/* Placeholder for loading state */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"> {/* Added items-stretch */}
            {displayTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-lg p-8 transition-transform hover:-translate-y-1 flex flex-col h-full" // Added h-full and flex-col
              >
                <div className="flex-grow"> {/* Added flex-grow to content area */}
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                      <Star key={i} className="fill-current" size={18} />
                    ))}
                    {testimonial.rating % 1 !== 0 && <StarHalf className="fill-current" size={18} />}
                    <span className="ml-1 text-gray-500 text-sm">{testimonial.rating}</span>
                  </div>
                  {/* Added line-clamp-4 to limit content height */}
                  <p className="text-gray-700 mb-6 italic line-clamp-4">{testimonial.content}</p>
                </div>
                <div className="flex items-center mt-auto"> {/* Added mt-auto to push to bottom */}
                  {/* Replaced Image component with a div for initials */}
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4 text-white font-bold text-lg">
                    {getInitials(testimonial.name)}
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
