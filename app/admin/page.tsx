// app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Your NextAuth configuration

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Admin Dashboard</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Welcome, {session?.user?.name || "Admin"}!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Quick Stats/Summary Cards can go here */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Total Books</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">Loading...</p> {/* Replace with actual data */}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Total Users</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">Loading...</p> {/* Replace with actual data */}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">New Messages</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">Loading...</p> {/* Replace with actual data */}
        </div>
      </div>
    </div>
  )
}