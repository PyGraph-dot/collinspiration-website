// app/terms-of-service/page.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Collinspiration',
  description: 'Our terms of service outline the rules and regulations for the use of Collinspiration\'s Website.',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Terms of Service</h1>
      <p className="mb-4 text-gray-700">Last updated: June 6, 2025</p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">1. Acceptance of Terms</h2>
      <p className="mb-4 text-gray-700">
        By accessing and using the Collinspiration website (the "Service"), you accept and agree to be bound by the
        terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">2. Description of Service</h2>
      <p className="mb-4 text-gray-700">
        Collinspiration provides users with access to a rich collection of resources, including various
        communication tools, forums, shopping services, personalized content, and programming
        through its network of properties (the "Service"). You understand and agree that the Service
        may include advertisements and that these advertisements are necessary for Collinspiration to provide the Service.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">3. User Conduct</h2>
      <p className="mb-4 text-gray-700">
        You agree that you are responsible for your own communications and for any consequences thereof.
        Your use of the Service is subject to your acceptance of and compliance with the Agreement. You agree that you will not use
        the Service to upload, post, email, transmit or otherwise make available any content that is unlawful,
        harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful,
        or racially, ethnically or otherwise objectionable.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">4. Intellectual Property Rights</h2>
      <p className="mb-4 text-gray-700">
        All content on the Service, including but not limited to text, graphics, logos, button icons, images,
        audio clips, digital downloads, data compilations, and software, is the property of Collinspiration
        or its content suppliers and protected by international copyright laws.
      </p>

      <p className="text-gray-700">
        For any questions regarding these Terms of Service, please contact us at collinspiration@example.com.
      </p>
    </div>
  );
}
