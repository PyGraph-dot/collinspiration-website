// app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Your NextAuth configuration
import DashboardStats from "@/components/admin/dashboard-stats"; // Import the new component

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // You can derive the page title here if needed for AdminHeader,
  // but for the dashboard itself, a welcome message is more fitting.
  const userName = session?.user?.name || "Admin";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Welcome, {userName}!
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Here's a quick overview of your Collinspiration platform.
      </p>

      {/* Render the DashboardStats client component */}
      <DashboardStats />
    </div>
  )
}
