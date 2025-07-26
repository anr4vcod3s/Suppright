import React from "react";
import Link from "next/link";
import Head from "next/head";
const TosPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms of Service | Suppright</title>
        <meta
          name="description"
          content="Review the Terms of Service for Suppright, including data accuracy, liability, and affiliate disclosures."
        />
        <link rel="canonical" href="https://www.suppright.com/terms" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Terms of Service",
              description:
                "Review the Terms of Service for Suppright, including data accuracy, liability, and affiliate disclosures.",
              url: "https://www.suppright.com/terms",
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
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last Updated: June 16, 2025
        </p>

        <div className="space-y-8 text-base leading-relaxed dark:text-gray-200">
          <p>
            Welcome to Suppright. By accessing or using our website, you agree
            to be bound by these Terms of Service and our{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <section>
            <h2 id="data-disclaimer" className="text-2xl font-semibold mb-2">
              Data Accuracy and Disclaimer
            </h2>
            <p>
              The information provided on Suppright, including but not limited
              to nutritional data, ingredients, and pricing, is for
              informational purposes only. We use automated systems, including
              Large Language Models (LLMs), to gather and parse this data from
              publicly available sources.
            </p>
            <p className="mt-2">
              While we strive for accuracy, we cannot guarantee that the
              information is always complete, current, or error-free. Prices and
              product details change frequently.{" "}
              <strong className="font-bold">
                You must verify all information on the retailer&apos;s website
                before making any purchase.
              </strong>
            </p>
          </section>

          <section>
            <h2 id="liability" className="text-2xl font-semibold mb-2">
              Limitation of Liability
            </h2>
            <p>
              Suppright is provided on an &quot;as is&quot; basis. We are not
              liable for any decisions made based on the information on this
              site. Your use of the information is at your own risk.
            </p>
          </section>

          <section>
            <h2
              id="affiliate-disclosure"
              className="text-2xl font-semibold mb-2"
            >
              Affiliate Disclosure
            </h2>
            <p>
              To support the operational costs of this site, Suppright
              participates in affiliate marketing programs. This means that when
              you click on links to retailer sites and make a purchase, we may
              earn a small commission at no additional cost to you.
            </p>
            <p className="mt-2">
              Our participation in these programs does not influence the data we
              present. Our primary commitment is to provide objective,
              data-driven comparisons to you, the user.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <span className="font-medium">contact@suppright.com</span>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TosPage;
