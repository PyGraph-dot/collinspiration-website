// app/admin/account/page.tsx
'use client';

import { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Metadata for the page (not strictly needed for client component, but good practice if it were server)
// export const metadata: Metadata = {
//   title: 'Admin Account',
//   description: 'Manage your administrator account.',
// };

export default function AdminAccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    } else if (status === 'unauthenticated') {
      // Redirect to login if not authenticated, though layout.tsx should handle this.
      router.push('/login');
    }
  }, [session, status, router]);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!session?.user?.id) {
      toast.error('User ID not found. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update account');
      }

      // Update the session directly if possible (NextAuth's update function)
      await update({ user: { name, email } });

      toast.success('Account updated successfully!');
    } catch (error: any) {
      console.error('Error updating account:', error);
      toast.error(error.message || 'Error updating account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <p className="ml-2 text-gray-600 dark:text-gray-400">Loading account data...</p>
      </div>
    );
  }

  // Only render form if authenticated and session user data is available
  if (status === 'authenticated' && session?.user) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Account Settings
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Profile Information
          </h2>
          <form onSubmit={handleUpdateAccount} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="mt-1 block w-full"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </div>

        {/* You could add a password change section here */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Change Password
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            (Future integration: Add a form here for changing the user&apos;s password.)
          </p>
        </div>
      </div>
    );
  }

  // Fallback for unauthenticated state, though router.push should handle it first
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 dark:text-gray-400">Access Denied. Please log in.</p>
    </div>
  );
}
