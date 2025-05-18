"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
    message: "Price must be a valid number",
  }),
  category: z.string().min(1, { message: "Please select a category" }),
  type: z.enum(["my-book", "affiliate"]),
  amazonLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  nigerianLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  publishImmediately: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function BookForm({ book = null }: { book?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(book?.coverImage || null)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: book?.title || "",
      description: book?.description || "",
      price: book?.price ? book.price.toString() : "",
      category: book?.category || "",
      type: book?.type || "my-book",
      amazonLink: book?.amazonLink || "",
      nigerianLink: book?.nigerianLink || "",
      publishImmediately: book?.status === "published" || false,
    },
  })

  const bookType = watch("type")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: FormValues) => {
    if (!coverImage && !coverPreview) {
      toast({
        title: "Error",
        description: "Please upload a cover image",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, you would upload the image to a storage service
      // and then save the book data with the image URL

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: book ? "Book updated successfully" : "Book created successfully",
      })

      // Redirect to books list
      router.push("/admin/books")
      router.refresh()
    } catch (error) {
      console.error("Error saving book:", error)
      toast({
        title: "Error",
        description: "Failed to save book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book Details</CardTitle>
              <CardDescription>Enter the details of your book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter book title"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter book description"
                  rows={5}
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register("price")}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setValue("category", value)} defaultValue={book?.category || ""}>
                    <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grammar">Grammar</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                      <SelectItem value="speaking">Speaking</SelectItem>
                      <SelectItem value="vocabulary">Vocabulary</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
                </div>
              </div>

              <div>
                <Label>Book Type</Label>
                <RadioGroup
                  defaultValue={book?.type || "my-book"}
                  onValueChange={(value) => setValue("type", value as "my-book" | "affiliate")}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="my-book" id="my-book" />
                    <Label htmlFor="my-book">My Book</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="affiliate" id="affiliate" />
                    <Label htmlFor="affiliate">Affiliate</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="amazonLink">Amazon Link (Hard Copy)</Label>
                <Input
                  id="amazonLink"
                  placeholder="https://amazon.com/..."
                  {...register("amazonLink")}
                  className={errors.amazonLink ? "border-red-500" : ""}
                />
                {errors.amazonLink && <p className="mt-1 text-sm text-red-500">{errors.amazonLink.message}</p>}
              </div>

              <div>
                <Label htmlFor="nigerianLink">Nigerian Link (Soft Copy)</Label>
                <Input
                  id="nigerianLink"
                  placeholder="https://example.com/..."
                  {...register("nigerianLink")}
                  className={errors.nigerianLink ? "border-red-500" : ""}
                />
                {errors.nigerianLink && <p className="mt-1 text-sm text-red-500">{errors.nigerianLink.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book Cover</CardTitle>
              <CardDescription>Upload a cover image for your book</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <input type="file" id="coverImage" accept="image/*" onChange={handleImageChange} className="hidden" />
                <label htmlFor="coverImage" className="cursor-pointer">
                  {coverPreview ? (
                    <div className="mb-4">
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="mx-auto h-48 object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Drag and drop your file here</p>
                      <p className="text-xs text-gray-500">or</p>
                    </div>
                  )}
                  <Button type="button" variant="outline" className="mt-2">
                    Browse Files
                  </Button>
                  <p className="mt-2 text-xs text-gray-500">Supported formats: JPG, PNG, PDF</p>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="publishImmediately"
                  checked={watch("publishImmediately")}
                  onCheckedChange={(checked) => setValue("publishImmediately", checked)}
                />
                <Label htmlFor="publishImmediately">Publish immediately</Label>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/books")}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("publishImmediately", false)
            handleSubmit(onSubmit)()
          }}
        >
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {book ? "Updating..." : "Creating..."}
            </>
          ) : book ? (
            "Update Book"
          ) : (
            "Create Book"
          )}
        </Button>
      </div>
    </form>
  )
}
