import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Our policy regarding the use of cookies on the Collinspiration website.',
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
        Cookie Policy
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">
        Last updated: June 7, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          1. What Are Cookies?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Cookies are small pieces of data stored on your device (computer or mobile device) when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide reporting information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          2. How We Use Cookies
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We use cookies for several purposes, including:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            <strong className="font-semibold">Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our Website and to enable you to use some of its features, such as access to secure areas.
          </li>
          <li>
            <strong className="font-semibold">Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like remembering your preferences) may become unavailable.
          </li>
          <li>
            <strong className="font-semibold">Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
          </li>
          <li>
            <strong className="font-semibold">Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          3. Your Choices Regarding Cookies
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner (if applicable), or by setting your preferences within your web browser.
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            <strong className="font-semibold">Browser Controls:</strong> Most web browsers allow you to manage your cookie preferences through their settings. You can set your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features or services on our Website may not function properly without cookies.
          </li>
          <li>
            <strong className="font-semibold">Third-Party Cookies:</strong> Our Website may use third-party cookies for analytics or advertising. You can typically opt-out of these through the respective third-party&apos;s opt-out programs. {/* FIXED: Escaped apostrophe */}
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          4. Changes to This Cookie Policy
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Cookie Policy periodically for any changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          5. Contact Us
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          If you have any questions about this Cookie Policy, please contact us at collinspiration.
        </p>
      </section>
    </div>
  );
}
