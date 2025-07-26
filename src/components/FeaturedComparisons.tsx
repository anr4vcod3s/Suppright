'use client';

import Link from 'next/link';

export default function FeaturedProducts() {
  return (
    <section className="max-w-6xl mx-auto my-16 px-4">
      <h2 className="text-2xl md:text-4xl font-bold mb-10 text-center">
        Featured Supplement Picks
      </h2>

      <div className="w-4/5 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center space-y-3 min-h-[180px]">
          <h3 className="text-lg font-semibold">Avvatar</h3>
          <p className="text-lg text-neutral-700 dark:text-neutral-300">
            Isorich Protein
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center space-y-3 min-h-[180px]">
          <h3 className="text-lg font-semibold">The Whole Truth</h3>
          <p className="text-lg text-neutral-700 dark:text-neutral-300">
            Pure Whey Protein Isolate
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center space-y-3 min-h-[180px]">
          <h3 className="text-lg font-semibold">Nutrabox</h3>
          <p className="text-lg text-neutral-700 dark:text-neutral-300">
            Swiss Chocolate 100% Whey Protein
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          href="/compare/avvatar-isorich-protein-vs-the-whole-truth-pure-whey-protein-isolate-vs-nutrabox-swiss-chocolate-100-whey-protein"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-400/70 via-indigo-600/70 to-indigo-400/70 text-white font-semibold text-lg shadow-xl hover:scale-105 transition-transform"
        >
          Compare These
        </Link>
      </div>
    </section>
  );
}