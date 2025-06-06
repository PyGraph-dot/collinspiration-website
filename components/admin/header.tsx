// components/admin/header.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"; // Import usePathname

interface AdminHeaderProps {
  // Add a prop to dynamically set the page title
  pageTitle?: string;
}

// Map pathname to a readable title
const getPageTitleFromPathname = (pathname: string) => {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.startsWith('/admin/books')) return 'Books';
  if (pathname.startsWith('/admin/categories')) return 'Categories';
  if (pathname.startsWith('/admin/analytics')) return 'Analytics';
  if (pathname.startsWith('/admin/settings')) return 'Settings';
  if (pathname.startsWith('/admin/account')) return 'Account';
  if (pathname.startsWith('/admin/notifications')) return 'Notifications';
  return 'Admin Panel'; // Default fallback
};


export default function AdminHeader({ pageTitle }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [notifications, _setNotifications] = useState(3);
  const pathname = usePathname(); // Get current pathname

  // Determine the title based on prop or pathname
  const currentTitle = pageTitle || getPageTitleFromPathname(pathname);

  return (
    <header className="bg-white shadow-sm z-10 sticky top-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center lg:ml-64">
          {/* Display dynamic title */}
          <h1 className="text-xl font-semibold">{currentTitle}</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white w-64"
            />
            <div className="absolute left-3 top-2.5 text-gray-500 w-4 h-4 flex items-center justify-center">
              <Search size={16} />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {/* Adjusted padding for better visibility */}
                    {notifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="py-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">New book added</span>
                    <span className="text-sm text-muted-foreground">
                      You added &quot;Creative Marketing&quot; to your collection
                    </span>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">New sale</span>
                    <span className="text-sm text-muted-foreground">You sold 5 copies of &quot;Financial Freedom&quot;</span>
                    <span className="text-xs text-gray-400">5 hours ago</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-3 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">New review</span>
                    <span className="text-sm text-muted-foreground">Alexandra Thompson left a 5-star review</span>
                    <span className="text-xs text-gray-400">Yesterday</span>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">
                <Link href="/admin/notifications" className="text-primary font-medium">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                  <Image
                    src="/images/avatar.jpg"
                    alt="User"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{session?.user?.name || "Admin User"}</div>
                  {/* Adjusted spacing for role text */}
                  <div className="text-xs text-gray-500 mt-0.5">Administrator</div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/admin/account" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/api/auth/signout" className="w-full">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
