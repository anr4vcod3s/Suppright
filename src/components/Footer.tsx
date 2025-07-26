// components/Footer.tsx
"use client";
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-neutral-200 dark:from-stone-950 dark:to-slate-800  pt-12 mt-14 pb-24">
      {/* FIX: Added min-height to the container to stabilize layout during font loading. */}
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center space-y-8 min-h-[120px] justify-center">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-base text-neutral-600 dark:text-neutral-200 opacity-90">
          <Link
            href="/about"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            About Me
          </Link>
          <Link
            href="/terms-of-service"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Privacy Policy
          </Link>
        </nav>

        {/* Divider */}
        <div className="w-40 border-t border-black/30 dark:border-white/30 opacity-50" />

        {/* Copyright */}
        <p className="text-center text-sm text-neutral-950 dark:text-neutral-100 tracking-wide opacity-70">
          © {year} SuppRight. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;