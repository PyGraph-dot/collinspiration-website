export interface Book {
  id: string
  title: string
  description: string
  coverImage: string
  price: number
  category: string
  type: "my-book" | "affiliate"
  amazonLink: string
  nigerianLink: string
  status: "published" | "draft"
  createdAt: string
  updatedAt: string
}
