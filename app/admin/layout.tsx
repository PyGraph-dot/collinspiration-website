// app/admin/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
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

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar - Adjust path as needed */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Admin Header - Adjust path as needed */}
        <AdminHeader />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}