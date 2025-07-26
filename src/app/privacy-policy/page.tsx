import React from "react";
import Link from "next/link";
import Head from "next/head";

const PrivacyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Suppright</title>
        <meta
          name="description"
          content="Review the Privacy Policy for Suppright to understand what information we collect and how we protect your privacy."
        />
        <link rel="canonical" href="https://www.suppright.com/privacy" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Privacy Policy",
              description:
                "Review the Privacy Policy for Suppright to understand what information we collect and how we protect your privacy.",
              url: "https://www.suppright.com/privacy",
              publisher: {
                "@type": "Organization",
                name: "Suppright",
                url: "https://www.suppright.com",
              },
            }),
          }}
        />
      </Head>

      <div className="container mt-32 mx-auto max-w-3xl p-4 py-12">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last Updated: June 16, 2025
        </p>

        <div className="space-y-8 text-base leading-relaxed dark:text-gray-200">
          <p>
            Suppright (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
            protecting your privacy. This Privacy Policy explains what data we
            collect, how we use it, and your choices when you use our website. By
            using this site, you acknowledge our{" "}
            <Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 underline">
              Terms of Service
            </Link>{" "}
            and this Privacy Policy.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
            <p>
              We do not require you to create an account or provide personal
              information to use our core services. However, we may
              automatically collect non-personal information such as:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Usage Data:</strong> Information about how you navigate
                our site (pages visited, features used, and time spent).
              </li>
              <li>
                <strong>Analytics Data:</strong> Data collected by tools like
                Vercel Analytics and Google Analytics, including your IP
                address, browser, and device information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to monitor
              activity and improve your experience. Some affiliate links also
              use cookies to track referrals. You can configure your browser to
              refuse cookies at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">How We Use Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide and maintain our website.</li>
              <li>Monitor usage and analyze trends.</li>
              <li>Support affiliate marketing programs that fund our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <span className="font-medium">contact@suppright.com</span>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
