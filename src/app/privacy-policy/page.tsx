import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mt-10 mx-auto max-w-3xl p-4 py-12">
  <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
  <p className="text-sm text-gray-500">Last Updated: [Date]</p>

  <div className="prose prose-lg mt-8 max-w-none dark:prose-invert">
    <p>
      <strong>[Your Website Name]</strong> (&quot;us&quot;, &quot;we&quot;, or
      &quot;our&quot;) operates the <strong>[Your Website URL]</strong> website
      (the &quot;Service&quot;). This page informs you of our policies
      regarding the collection, use, and disclosure of personal data when you
      use our Service and the choices you have associated with that data.
    </p>

    <h2 className="mt-8">1. Information Collection and Use</h2>
    <p>
      We collect several different types of information for various purposes to
      provide and improve our Service to you.
    </p>
    <h3>Types of Data Collected</h3>
    <h4>Usage Data (Analytics)</h4>
    <p>
      We may collect information on how the Service is accessed and used
      (&quot;Usage Data&quot;). We use Vercel Analytics, a privacy-first
      analytics service, to collect this data. Vercel Analytics does not use
      cookies and does not collect personally identifiable information (PII).
      This Usage Data may include information such as your device&apos;s
      general location (country-level), browser type, browser version, the
      pages of our Service that you visit, the time and date of your visit, and
      other diagnostic data.
    </p>

    <h2 className="mt-8">2. How We Use Your Information</h2>
    <ul>
      <li>To provide and maintain our Service</li>
      <li>To monitor the usage of our Service</li>
      <li>To detect, prevent and address technical issues</li>
      <li>To analyze trends and improve the user experience</li>
    </ul>

    <h2 className="mt-8">3. Third-Party Links & Affiliate Links</h2>
    <p>
      Our Service contains links to other sites that are not operated by us,
      including affiliate links to retailer websites. If you click on a
      third-party link, you will be directed to that third party&apos;s site.
      We strongly advise you to review the Privacy Policy of every site you
      visit.
    </p>
    <p>
      We have no control over and assume no responsibility for the content,
      privacy policies, or practices of any third-party sites or services. When
      you click on an affiliate link, the destination retailer may place
      cookies on your browser to track the referral from our site.
    </p>

    <h2 className="mt-8">4. Data Security</h2>
    <p>
      The security of your data is important to us, but remember that no method
      of transmission over the Internet or method of electronic storage is 100%
      secure. While we strive to use commercially acceptable means to protect
      your Personal Data, we cannot guarantee its absolute security.
    </p>

    <h2 className="mt-8">5. Children&apos;s Privacy</h2>
    <p>
      Our Service does not address anyone under the age of 18
      (&quot;Children&quot;). We do not knowingly collect personally
      identifiable information from anyone under the age of 18.
    </p>

    <h2 className="mt-8">6. Changes to This Privacy Policy</h2>
    <p>
      We may update our Privacy Policy from time to time. We will notify you of
      any changes by posting the new Privacy Policy on this page. You are
      advised to review this Privacy Policy periodically for any changes.
    </p>

    <h2 className="mt-8">7. Contact Us</h2>
    <p>
      If you have any questions about this Privacy Policy, please contact us at:{" "}
      <strong>[Your Contact Email]</strong>.
    </p>
  </div>
</div>
  );
};

export default PrivacyPolicy;