// app/admin/layout.tsx
import { getServerSession } from "next-auth/next" // For server-side session checks
import { authOptions } from "@/lib/auth" // Your NextAuth configuration
import { redirect } from "next/navigation" // For redirecting unauthenticated users
import Link from "next/link"
import { Separator } from "@/components/ui/separator" // Assuming you have Shadcn UI Separator
import { Button } from "@/components/ui/button" // Assuming you have Shadcn UI Button
import { Home, Book, FileText, Users, Settings, LogOut } from "lucide-react" // Icons

// --- Navigation Links Data ---
const navLinks = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Books", href: "/admin/books", icon: Book },
  { name: "Blog Articles", href: "/admin/blog", icon: FileText },
  // { name: "Users", href: "/admin/users", icon: Users }, // Uncomment if you add user management
  // { name: "Settings", href: "/admin/settings", icon: Settings }, // Uncomment if you add settings
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has ADMIN role
  if (!session || !session.user || session.user.role !== "ADMIN") {
    // Redirect to login or a forbidden page if not authorized
    redirect("/login?callbackUrl=/admin"); // Redirect to login, passing the admin URL as callback
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Button
              key={link.name}
              asChild
              variant="ghost"
              className="w-full justify-start text-lg px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Link href={link.href}>
                <link.icon className="mr-3 h-5 w-5" />
                {link.name}
              </Link>
            </Button>
          ))}
          <Separator className="my-4" />
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-lg px-4 py-2 text-red-500 hover:text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {/* For logout, you'd typically have a form or a separate client component that calls signOut() */}
            <Link href="/api/auth/signout"> {/* This will trigger NextAuth's signout flow */}
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Link>
          </Button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        {children} {/* This is where your page content will be rendered */}
      </main>
    </div>
  )
}