import React from "react";
import Link from "next/link";

const TosPage: React.FC = () => {
  return (
    <div className="container mt-32 mx-auto max-w-3xl p-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Last Updated: June 16, 2025
      </p>

      <div className="prose prose-lg mt-8 max-w-none dark:prose-invert">
        <p>
          Welcome to Suppright. By accessing or using our website, you agree to
          be bound by these Terms of Service and our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2 id="data-disclaimer">Data Accuracy and Disclaimer</h2>
        <p>
          The information provided on Suppright, including but not limited to
          nutritional data, ingredients, and pricing, is for informational
          purposes only. We use automated systems, including Large Language
          Models (LLMs), to gather and parse this data from publicly available
          sources.
        </p>
        <p>
          While we strive for accuracy, we cannot guarantee that the information
          is always complete, current, or error-free. Prices and product
          details change frequently.{" "}
          <strong>
            You must verify all information on the retailer&apos;s website
            before making any purchase.
          </strong>
        </p>

        <h2 id="liability">Limitation of Liability</h2>
        <p>
          Suppright is provided on an &quot;as is&quot; basis. We are not liable
          for any decisions made based on the information on this site. Your use
          of the information is at your own risk.
        </p>

        <h2 id="affiliate-disclosure">Affiliate Disclosure</h2>
        <p>
          To support the operational costs of this site, Suppright participates
          in affiliate marketing programs. This means that when you click on
          links to retailer sites and make a purchase, we may earn a small
          commission at no additional cost to you.
        </p>
        <p>
          Our participation in these programs does not influence the data we
          present. Our primary commitment is to provide objective, data-driven
          comparisons to you, the user.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <strong>[your-email@example.com]</strong>.
        </p>
      </div>
    </div>
  );
};

export default TosPage;