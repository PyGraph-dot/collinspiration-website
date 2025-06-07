// app/admin/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { getServerSession } from "next-auth/next"; // Import getServerSession
import { authOptions } from "@/lib/auth";       // Your NextAuth configuration
import { redirect } from "next/navigation";     // Import redirect for server-side redirection

import AdminSidebar from '@/components/admin/sidebar'; // Assuming you have a sidebar component
import AdminHeader from '@/components/admin/header';   // Assuming you have a header component

// Define metadata for the admin section
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin panel for managing content and users.',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Fetch the session on the server-side
  const session = await getServerSession(authOptions);

  // IMPORTANT: Enforce authentication and authorization
  // If no session exists, or if the user is not an ADMIN, redirect to login
  if (!session || !session.user || session.user.role !== "ADMIN") {
    console.warn("Unauthorized access attempt to admin dashboard. Redirecting to login.");
    redirect('/login'); // Redirect unauthenticated/unauthorized users
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Admin Header */}
        <AdminHeader />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
