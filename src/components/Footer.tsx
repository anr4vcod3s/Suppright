// components/ui/Footer.tsx
"use client";
import React from "react";
import Link from "next/link";
// components/ui/Footer.tsx
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 pb-40 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="mb-2">© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <Link href="/about" className="hover:underline">
            About Me
          </Link>
          <Link href="/terms-of-service" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;