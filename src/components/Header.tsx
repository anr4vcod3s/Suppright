'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchComponent } from '@/components/SearchComponent';

const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const Header = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;
      const isScrolledPastThreshold = currentScrollPos > 100;
      
      setVisible(!isScrollingDown || !isScrolledPastThreshold);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center px-4 z-50 transition-all duration-300" 
         style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="w-full max-w-5xl mt-2 px-4 sm:px-8 py-4 bg-white dark:bg-black rounded-full border border-black/[0.2] dark:border-white/[0.2] shadow-input flex items-center justify-between"
      >
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <Link href="/">
            <div className="text-2xl font-bold italic cursor-pointer text-black dark:text-white">
              SUPPCHECK
            </div>
          </Link>
        </motion.div>

        {/* Search or Scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
        >
          {pathname === '/compare' ? (
            <SearchComponent />
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const heroSection = document.getElementById('hero');
                if (heroSection) {
                  heroSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-lg text-gray-600 dark:text-neutral-200 hover:text-black dark:hover:text-white"
            >
              Search
            </motion.button>
          )}
        </motion.div>
      </motion.header>
    </div>
  );
};

export default Header;