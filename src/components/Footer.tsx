"use client";
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-slate-300 dark:from-stone-950 dark:to-slate-950  pt-6 mt-6 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center space-y-8">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-base text-neutral-600 dark:text-neutral-200 opacity-90">
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            About Me
          </Link>
          <Link href="/terms-of-service" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Privacy Policy
          </Link>
        </nav>

        {/* Divider */}
        <div className="w-40 border-t border-neutral-300 dark:border-white/10 opacity-50" />

        {/* Copyright */}
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 tracking-wide opacity-70">
          © {year} SuppRight. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
