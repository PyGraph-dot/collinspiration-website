// components/admin/sidebar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Tag, BarChart, Settings, User, LogOut, Menu, X } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Books",
      icon: BookOpen,
      href: "/admin/books",
    },
    {
      title: "Categories",
      icon: Tag,
      href: "/admin/categories",
    },
    {
      title: "Analytics",
      icon: BarChart,
      href: "/admin/analytics",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
    {
      title: "Account",
      icon: User,
      href: "/admin/account",
    },
  ]

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b">
          <h1 className="font-pacifico text-2xl text-primary">Collinspiration</h1>
        </div>

        <div className="py-4">
          <div className="px-6 mb-4 text-gray-500 text-xs font-semibold uppercase">Main Menu</div>

          <nav>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-3 text-gray-700 ${
                  isActive(item.href)
                    ? "bg-primary/10 border-l-3 border-primary font-semibold text-primary"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-6 h-6 flex items-center justify-center mr-3">
                  <item.icon size={20} />
                </div>
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Removed the extra '...' div */}
          <div className="px-6 mt-6 mb-4 text-gray-500 text-xs font-semibold uppercase">Account</div>

          <Link
            href="/api/auth/signout"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-6 h-6 flex items-center justify-center mr-3">
              <LogOut size={20} />
            </div>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
