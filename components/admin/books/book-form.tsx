// components/admin/books/book-form.tsx
'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem, // Make sure FormItem is imported
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod schema for validating incoming book data
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(255),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  coverImage: z.any().optional(), // Can be File object or string URL
  // Use z.coerce.number() for more robust type conversion from input, then positive()
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  type: z.enum(["MY_BOOK", "AFFILIATE"], {
    errorMap: () => ({ message: "Please select a book type." }),
  }),
  amazonLink: z.string().url("Invalid Amazon link URL").optional().or(z.literal('')),
  nigerianLink: z.string().url("Invalid Nigerian link URL").optional().or(z.literal('')),
  status: z.enum(["PUBLISHED", "DRAFT"], {
    errorMap: () => ({ message: "Please select a status." }),
  }),
});

interface BookFormProps {
  initialData?: any;
  categories: { id: string; name: string }[];
}

export function BookForm({ initialData, categories }: BookFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title || "",
      description: initialData.description || "",
      coverImage: initialData.coverImage || undefined,
      // Ensure price is explicitly a number here, even if it's 0
      price: Number(initialData.price) || 0,
      categoryId: initialData.categoryId || "",
      type: initialData.type || "MY_BOOK",
      amazonLink: initialData.amazonLink || "",
      nigerianLink: initialData.nigerianLink || "",
      status: initialData.status || "DRAFT",
    } : {
      title: "",
      description: "",
      coverImage: undefined,
      price: 0, // Ensure default price is a number
      categoryId: "",
      type: "MY_BOOK",
      amazonLink: "",
      nigerianLink: "",
      status: "DRAFT",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let coverImageUrl: string | null = initialData?.coverImage || null; // Initialize with existing or null

      // Handle actual image upload to Cloudinary
      if (values.coverImage instanceof File) {
        toast.info("Uploading image...");
        const formData = new FormData();
        formData.append('file', values.coverImage);

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || "Failed to upload image to Cloudinary.");
        }

        const uploadResult = await uploadResponse.json();
        coverImageUrl = uploadResult.imageUrl; // Get the actual Cloudinary URL
        toast.success("Image uploaded successfully!");
      } else if (values.coverImage === undefined) {
        // If initialData.coverImage was null/undefined and no new file selected, keep it null
        coverImageUrl = null;
      } else if (typeof values.coverImage === 'string') {
        // If it's an existing URL (string) and no new file selected, keep it as is
        coverImageUrl = values.coverImage;
      }


      const dataToSave = {
        title: values.title,
        description: values.description,
        coverImage: coverImageUrl, // Use the real Cloudinary URL or null
        price: values.price,
        categoryId: values.categoryId,
        type: values.type,
        amazonLink: values.amazonLink === '' ? null : values.amazonLink,
        nigerianLink: values.nigerianLink === '' ? null : values.nigerianLink,
        status: values.status,
      };

      let response;
      if (initialData) {
        response = await fetch(`/api/books/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });
      } else {
        response = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong.");
      }

      toast.success(initialData ? "Book updated successfully!" : "Book created successfully!");
      router.push("/admin/books");
      router.refresh();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Failed to save book.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter book title" {...field} />
              </FormControl>
              <FormDescription>
                The main title of the book.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide a detailed description of the book" {...field} rows={5} />
              </FormControl>
              <FormDescription>
                A comprehensive overview of the book&apos;s content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Image Input Field */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...fieldProps}
                  onChange={(event) => {
                    onChange(event.target.files && event.target.files[0]);
                  }}
                />
              </FormControl>
              <FormDescription>
                Upload the book&apos;s cover image (JPG, PNG, GIF).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Display current image if initialData exists and has a coverImage URL */}
        {initialData?.coverImage && (
          <div className="mt-2">
            <FormLabel>Current Cover:</FormLabel>
            <Image
              src={initialData.coverImage}
              alt="Current Cover"
              width={128} // Provide appropriate width
              height={128} // Provide appropriate height
              className="object-cover rounded-md mt-1"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"; // Fallback to a local placeholder if needed
                e.currentTarget.alt = "Image not found";
              }}
            />
          </div>
        )}

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 29.99" {...field} />
              </FormControl>
              <FormDescription>
                The price of the book in dollars.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : null}
                </SelectContent>
              </Select>
              <FormDescription>
                Assign the book to a category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type (my-book / affiliate) */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Book Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MY_BOOK" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      My Book (Soft Copy - Naira)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"> {/* FIXED: Closing FormItem */}
                    <FormControl>
                      <RadioGroupItem value="AFFILIATE" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Affiliate (Hard Copy - Dollar)
                    </FormLabel>
                  </FormItem> {/* FIXED: Closing FormItem */}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amazon Link */}
        <FormField
          control={form.control}
          name="amazonLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amazon Link (Hard Copy)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.amazon.com/your-book" {...field} />
              </FormControl>
              <FormDescription>
                Direct link to purchase hard copy on Amazon (or similar site).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nigerian Link */}
        <FormField
          control={form.control}
          name="nigerianLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nigerian Link (Soft Copy)</FormLabel>
              <FormControl>
                <Input placeholder="https://your-nigerian-site.com/your-book" {...field} />
              </FormControl>
              <FormDescription>
                Direct link to purchase soft copy (Naira payment).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status (published / draft) */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Publication Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PUBLISHED" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Published
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"> {/* FIXED: Closing FormItem */}
                    <FormControl>
                      <RadioGroupItem value="DRAFT" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Draft
                    </FormLabel>
                  </FormItem> {/* FIXED: Closing FormItem */}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (initialData ? "Update Book" : "Create Book")}
        </Button>
      </form>
    </Form>
  );
}
