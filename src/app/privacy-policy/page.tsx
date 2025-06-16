import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <div className="container mt-32 mx-auto max-w-3xl p-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Last Updated: June 16, 2025
      </p>

      <div className="prose prose-lg mt-8 max-w-none dark:prose-invert">
        <p>
          Suppright (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, and disclose information about you when you use our
          website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We do not require you to create an account or provide any personal
          information to use our core service. However, we may collect
          non-personal information automatically, such as:
        </p>
        <ul>
          <li>
            <strong>Usage Data:</strong> Information about how you interact with
            our site, such as pages visited and features used.
          </li>
          <li>
            <strong>Analytics Data:</strong> We use third-party services like
            Vercel Analytics or Google Analytics to collect standard web log
            information, such as your IP address, browser type, and operating
            system, to help us understand traffic patterns and improve our
            service.
          </li>
        </ul>

        <h2>Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on
          our service and hold certain information. Affiliate links also use
          cookies to track referrals from our site to the retailer&apos;s site.
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent.
        </p>

        <h2>How We Use Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our website.</li>
          <li>Monitor and analyze usage and trends.</li>
          <li>Fulfill our operational needs for affiliate tracking.</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at <strong>[your-email@example.com]</strong>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;