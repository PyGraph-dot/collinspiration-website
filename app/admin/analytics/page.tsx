// app/admin/analytics/page.tsx
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin Analytics',
  description: 'View website analytics and statistics.',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Website Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Analytic Card 1 */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Total Books</h2>
          <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">...</p>
          <p className="text-gray-600 dark:text-gray-400">Available books</p>
        </div>

        {/* Example Analytic Card 2 */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Total Users</h2>
          <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">...</p>
          <p className="text-gray-600 dark:text-gray-400">Registered users</p>
        </div>

        {/* Example Analytic Card 3 */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Messages Received</h2>
          <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">...</p>
          <p className="text-gray-600 dark:text-gray-400">Contact form submissions</p>
        </div>

        {/* You can add more cards for blog posts, categories, etc. */}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center text-gray-600 dark:text-gray-400">
        <p>Analytics data will be displayed here once integrated with API endpoints.</p>
        <p className="mt-2">You can fetch data from routes like `/api/stats/blog`, `/api/stats/books`, `/api/stats/users`, etc.</p>
      </div>
    </div>
  );
}
