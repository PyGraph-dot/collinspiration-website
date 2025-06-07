// app/admin/settings/page.tsx
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin Settings',
  description: 'Manage website settings.',
};

export default function AdminSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Website Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          General Settings
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>This section is for managing general website settings.</p>
          <p>
            You can add forms and input fields here for configurable options like:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Site title and description</li>
            <li>Contact email address</li>
            <li>Social media links</li>
            <li>Maintenance mode toggle</li>
          </ul>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            (Future integration: Implement forms and API endpoints to update these settings.)
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Advanced Settings
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>This area can be used for more advanced configurations.</p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            (Future integration: Add complex configurations here, e.g., API keys, integrations.)
          </p>
        </div>
      </div>
    </div>
  );
}
