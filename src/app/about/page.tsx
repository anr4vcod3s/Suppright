// src/app/about/page.tsx
import React from "react";
import Link from "next/link";
// If you add a photo, uncomment this
// import Image from "next/image";

// Icons for the "shiny" section
import { DatabaseZap, Scale, IndianRupee } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="container mt-32 mx-auto max-w-4xl p-4 py-12">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          About Us
        </h1>
      </div>

      <div className="prose text-lg prose-lg mx-auto mt-10 max-w-none dark:prose-invert">
        {/* <Image src="/path/to/your-photo.jpg" alt="Your Name" width={150} height={150} className="mx-auto rounded-full" /> */}

        <p className="text-center ">
          Welcome! I&apos;m <strong>Arnav</strong>, the founder of
          Suppright.
        </p><br></br>
        <p className="text-center">
          My own fitness journey led me to a common point of frustration:
          choosing the right supplement. I was looking for a straightforward way
          to compare products based on pure data—what’s inside and what it
          costs.
        </p><br></br>
        <p className="text-center">
          When I realized the tool I needed for the Indian market didn&apos;t
          exist, I decided to create it. Suppright is the result: a simple,
          data-first platform designed to empower your decisions.
        </p>
      </div>

      {/* --- The Shiny Section --- */}
      <div className="my-16">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Why Trust Suppright?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Badge 1: Data-Driven */}
          <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
              <DatabaseZap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Data-Driven</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We replace opinions with objective data. Our comparisons are built
              on nutritional and pricing information, giving you the facts
              without the fluff.
            </p>
          </div>

          {/* Badge 2: Unbiased & Transparent */}
          <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/50">
              <Scale className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Unbiased & Transparent</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our commitment is to you, the user. We&apos;re transparent about
              our affiliate model, which supports the site but never influences
              the data you see.
            </p>
          </div>

          {/* Badge 3: Built for India */}
          <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 rounded-full bg-orange-100 p-3 dark:bg-orange-900/50">
              <IndianRupee className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Built for India</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Focused specifically on the products and pricing relevant to the
              Indian market. We built this to solve a local problem, for the
              local community.
            </p>
          </div>
        </div>
      </div>
      {/* --- End of Shiny Section --- */}

      <div className="text-center">
        <p className="text-gray-700 dark:text-gray-300">
          We believe in full transparency. For details on how our site operates,
          please review our{" "}
          <Link
            href="/tos"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default AboutPage;