// src/components/Footer.tsx
"use client";
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-secondary-border py-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-y-4">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/about"
              className="text-sm hover:underline hover:text-primary transition"
            >
              About Me
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm hover:underline hover:text-primary transition"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm hover:underline hover:text-primary transition"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-center sm:text-right">
            © {year} SuppRight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;