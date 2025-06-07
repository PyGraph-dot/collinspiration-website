"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  subscribe: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      subscribe: false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Submit contact form
      const contactResponse = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      })

      if (!contactResponse.ok) {
        throw new Error("Failed to submit contact form")
      }

      // If user subscribed to newsletter
      if (data.subscribe) {
        await fetch("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
          }),
        })
      }

      // Success
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      })

      reset()
    } catch (_error) { // Corrected: Renamed 'error' to '_error'
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">
              Have questions about our books or interested in scheduling a workshop? Reach out to us using the form
              below.
            </p>
          </div>

          <div className="bg-white rounded shadow-lg p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="What is this regarding?"
                  {...register("subject")}
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Your message here..."
                  {...register("message")}
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <div className="mb-8 flex items-center space-x-2">
                <Checkbox id="subscribe" {...register("subscribe")} />
                <label
                  htmlFor="subscribe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                >
                  Subscribe to our newsletter for English learning tips and book updates
                </label>
              </div>

              <div className="text-center">
                <Button type="submit" className="px-8 py-3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
