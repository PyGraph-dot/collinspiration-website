import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of the Collinspiration website.',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
        Terms of Service
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">
        Last updated: June 7, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          By accessing and using the Collinspiration website (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;), all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          2. Use License
        </h2>
        <p className="text-gray-700 dark:text-300 leading-relaxed">
          Permission is granted to temporarily download one copy of the materials (information or software) on Collinspiration&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on Collinspiration&apos;s website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
          This license shall automatically terminate if you violate any of these restrictions and may be terminated by Collinspiration at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          3. Disclaimer
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            The materials on Collinspiration&apos;s website are provided on an &apos;as is&apos; basis. Collinspiration makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </li>
          <li>
            Further, Collinspiration does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          4. Limitations
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          In no event shall Collinspiration or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Collinspiration&apos;s website, even if Collinspiration or a Collinspiration authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          5. Accuracy of Materials
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          The materials appearing on Collinspiration&apos;s website could include technical, typographical, or photographic errors. Collinspiration does not warrant that any of the materials on its website are accurate, complete or current. Collinspiration may make changes to the materials contained on its website at any time without notice. However, Collinspiration does not make any commitment to update the materials.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          6. Links
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Collinspiration has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Collinspiration of the site. Use of any such linked website is at the user&apos;s own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          7. Modifications
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Collinspiration may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          8. Governing Law
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction Here] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          9. Contact Us
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          If you have any questions about these Terms of Service, please contact us at collinspiration.
        </p>
      </section>
    </div>
  );
}
