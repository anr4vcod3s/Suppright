import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="container mt-10 mx-auto max-w-3xl p-4 py-12">
  <h1 className="mb-4 text-3xl font-bold">Terms of Service</h1>
  <p className="text-sm text-gray-500">Last Updated: [Date]</p>

  <div className="prose prose-lg mt-8 max-w-none dark:prose-invert">
    <p>
      Welcome to <strong>[Your Website Name]</strong>! These Terms of Service
      (&quot;Terms&quot;) govern your use of our website located at{" "}
      <strong>[Your Website URL]</strong> (the &quot;Service&quot;), operated
      by <strong>[Your Name or Company Name]</strong>.
    </p>
    <p>
      By accessing or using our Service, you agree to be bound by these Terms.
      If you disagree with any part of the terms, then you may not access the
      Service.
    </p>

    <h2 className="mt-8">1. Description of Service</h2>
    <p>
      <strong>[Your Website Name]</strong> provides information, analysis, and
      comparisons of various nutritional supplements, primarily whey proteins,
      available in the Indian market. Our goal is to present data in a clear,
      side-by-side format to help users make informed decisions.
    </p>

    <h2 className="mt-8 text-red-600 dark:text-red-400">
      2. IMPORTANT: Medical Disclaimer
    </h2>
    <p className="font-semibold">
      The content provided on this Service, including text, graphics, images,
      and other material, is for informational purposes only. It is not
      intended to be a substitute for professional medical advice, diagnosis,
      or treatment.
    </p>
    <p>
      Always seek the advice of your physician or other qualified health
      provider with any questions you may have regarding a medical condition or
      before starting any new supplement, diet, or fitness regimen. Never
      disregard professional medical advice or delay in seeking it because of
      something you have read on this Service.{" "}
      <strong>[Your Website Name]</strong> does not recommend or endorse any
      specific products, tests, physicians, procedures, opinions, or other
      information that may be mentioned on the Service.
    </p>

    <h2 className="mt-8">3. Affiliate Disclosure</h2>
    <p>
      Our Service is funded through affiliate marketing. This means that when
      you click on links to various merchants on this site and make a purchase,
      this can result in a commission that is credited to this site. This comes
      at no additional cost to you.
    </p>
    <p>
      We are a participant in various affiliate programs, including but not
      limited to [List 1-2 examples, e.g., Amazon Associates, MyProtein
      Affiliate Program]. Our goal is to provide unbiased data, and our
      affiliate relationships do not influence the information we present.
    </p>

    <h2 className="mt-8">4. Intellectual Property</h2>
    <p>
      The Service and its original content (excluding content provided by
      users), features, and functionality are and will remain the exclusive
      property of <strong>[Your Name or Company Name]</strong> and its
      licensors. The Service is protected by copyright, trademark, and other
      laws of both India and foreign countries.
    </p>

    <h2 className="mt-8">5. Limitation of Liability</h2>
    <p>
      In no event shall <strong>[Your Website Name]</strong>, nor its
      directors, employees, partners, agents, suppliers, or affiliates, be
      liable for any indirect, incidental, special, consequential or punitive
      damages, including without limitation, loss of profits, data, use,
      goodwill, or other intangible losses, resulting from your access to or
      use of or inability to access or use the Service.
    </p>
    <p>
      We do not warrant the accuracy, completeness, or usefulness of this
      information. Any reliance you place on such information is strictly at
      your own risk.
    </p>

    <h2 className="mt-8">6. Changes to Terms</h2>
    <p>
      We reserve the right, at our sole discretion, to modify or replace these
      Terms at any time. We will provide notice of any changes by posting the
      new Terms of Service on this page.
    </p>

    <h2 className="mt-8">7. Contact Us</h2>
    <p>
      If you have any questions about these Terms, please contact us at:{" "}
      <strong>[Your Contact Email]</strong>.
    </p>
  </div>
</div>
  );
};

export default TermsOfService;