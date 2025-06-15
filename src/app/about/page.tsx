// src/app/about/page.tsx
import React from "react";
//import Image from "next/image";  Optional: if you want to add a photo

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-3xl p-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">About [Your Website Name]</h1>

      <div className="prose prose-lg mt-8 max-w-none dark:prose-invert">
        {/* Optional: A photo of yourself is a huge trust builder */}
        {/* <Image src="/path/to/your-photo.jpg" alt="Your Name" width={150} height={150} className="rounded-full" /> */}

        <h2 className="mt-8">Our Mission</h2>
        <p>
          Welcome! My name is <strong>[Your Name]</strong>, and I&apos;m the
          creator of <strong>[Your Website Name]</strong>. I started this
          project out of a personal frustration: the supplement market in India
          is incredibly confusing. It&apos;s filled with marketing hype, biased
          reviews, and a real risk of counterfeit products. My goal was to
          create a simple, data-driven tool to cut through the noise and help
          people find the best supplement for their specific needs and budget.
        </p>

        <h2 className="mt-8">How It Works</h2>
        <p>
          This site isn&apos;t based on opinion. We gather publicly available
          data on nutritional information, pricing, and ingredients for a wide
          range of products. Our comparison table then presents this data in a
          clear, side-by-side format, allowing you to make your own informed
          decision based on the metrics that matter most to you.
        </p>

        <h2 className="mt-8">How We Stay Unbiased (Our Business Model)</h2>
        <p>
          To keep this site running and the data up-to-date, we participate in
          affiliate marketing programs. This means that if you click on a link
          to a retailer and make a purchase, we may receive a small commission
          at no extra cost to you. Our commitment is to you, the user, first.
          The data we present is not influenced by these relationships. We aim
to be the most objective and transparent resource for supplement comparison in India.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;