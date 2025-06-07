// app/cookie-policy/page.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Collinspiration',
  description: 'Our cookie policy explains how we use cookies and similar tracking technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Cookie Policy</h1>
      <p className="mb-4 text-gray-700">Last updated: June 6, 2025</p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">1. What are Cookies?</h2>
      <p className="mb-4 text-gray-700">
        Cookies are small text files that are placed on your computer or mobile device when you visit a website.
        They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">2. How We Use Cookies</h2>
      <p className="mb-4 text-gray-700">
        We use cookies for several purposes, including:
        <ul>
          <li>To enable certain functions of the Service.</li>
          <li>To provide analytics.</li>
          <li>To store your preferences.</li>
          <li>To enable advertisements delivery, including behavioral advertising.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">3. Types of Cookies We Use</h2>
      <p className="mb-4 text-gray-700">
        <ul>
          <li><strong>Essential Cookies:</strong> Necessary for the website to function.</li>
          <li><strong>Performance Cookies:</strong> Collect information about how you use our website, like which pages you visited.</li>
          <li><strong>Functionality Cookies:</strong> Remember choices you make (like your language or region) and provide enhanced features.</li>
          {/* REMOVED: Extra, unclosed </li> tag that was causing the syntax error */}
          <li><strong>Advertising Cookies:</strong> Used to deliver ads more relevant to you and your interests.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">4. Your Choices Regarding Cookies</h2>
      <p className="mb-4 text-gray-700">
        If you&apos;d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
        Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer.
      </p>

      <p className="text-gray-700">
        For any questions regarding this Cookie Policy, please contact us at collinspiration@example.com.
      </p>
    </div>
  );
}
