// app/privacy-policy/page.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Collinspiration',
  description: 'Our privacy policy details how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">Last updated: June 6, 2025</p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">1. Introduction</h2>
      <p className="mb-4 text-gray-700">
        Welcome to Collinspiration. This Privacy Policy explains how we collect, use, disclose, and safeguard your
        information when you visit our website collinspiration-website.vercel.app, including any other media form,
        media channel, mobile website, or mobile application related or connected thereto (collectively, the “Site”).
        Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
        please do not access the Site.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">2. Information We Collect</h2>
      <p className="mb-4 text-gray-700">
        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        Personal Data: Personally identifiable information, such as your name, shipping address, email address,
        and telephone number, and demographic information, such as your age, gender, hometown, and interests,
        that you voluntarily give to us when you register with the Site or when you choose to participate in
        various activities related to the Site, such as online chat and message boards.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">3. How We Use Your Information</h2>
      <p className="mb-4 text-gray-700">
        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience.
        Specifically, we may use information collected about you via the Site to:
        Administer contests, promotions, and surveys. Compile anonymous statistical data and analysis for use internally or with third parties.
        Create and manage your account. Enable user-to-user communications.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">4. Disclosure of Your Information</h2>
      <p className="mb-4 text-gray-700">
        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process,
        to investigate or remedy potential violations of our policies, or to protect the rights, property,
        or safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">5. Security of Your Information</h2>
      <p className="mb-4 text-gray-700">
        We use administrative, technical, and physical security measures to help protect your personal information.
        While we have taken reasonable steps to secure the personal information you provide to us, please be aware that
        despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission
        can be guaranteed against any interception or other type of misuse.
      </p>

      <p className="text-gray-700">
        For any questions regarding this Privacy Policy, please contact us at collinspiration@example.com.
      </p>
    </div>
  );
}
