// components/admin/dashboard-stats.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component from shadcn/ui

interface StatsData {
  totalBooks: number | null;
  totalUsers: number | null;
  newMessages: number | null;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalBooks: null,
    totalUsers: null,
    newMessages: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        // --- Fetch data from new API routes ---
        const [booksRes, usersRes, messagesRes] = await Promise.all([
          fetch('/api/stats/books'),
          fetch('/api/stats/users'),
          fetch('/api/stats/messages'),
        ]);

        if (!booksRes.ok || !usersRes.ok || !messagesRes.ok) {
          throw new Error("Failed to fetch all dashboard stats.");
        }

        const totalBooksData = await booksRes.json();
        const totalUsersData = await usersRes.json();
        const newMessagesData = await messagesRes.json();

        setStats({
          totalBooks: totalBooksData.count,
          totalUsers: totalUsersData.count,
          newMessages: newMessagesData.count,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Failed to load dashboard data. Please check server logs.");
        setStats({ totalBooks: null, totalUsers: null, newMessages: null }); // Clear stats on error
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []); // Empty dependency array as this effect runs once on mount

  const statCards = [
    { title: "Total Books", value: stats.totalBooks, color: "text-blue-600 dark:text-blue-400" },
    { title: "Total Users", value: stats.totalUsers, color: "text-green-600 dark:text-green-400" },
    { title: "New Messages", value: stats.newMessages, color: "text-purple-600 dark:text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {error && (
        <div className="col-span-full text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
          Error: {error}
        </div>
      )}

      {statCards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{card.title}</h3>
          {loading ? (
            <Skeleton className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p className={`text-3xl font-bold ${card.color}`}>
              {card.value !== null ? card.value : 'N/A'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
