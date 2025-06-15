'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchComponent } from '@/components/SearchComponent';
import { Product } from '@/lib/schemas';
import { Search } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;

      setVisible(!isScrollingDown);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleProductSelect = (product: Product) => {
    console.log('Selected product:', product);
  };

  const isComparePage = pathname === '/compare' || pathname.startsWith('/compare/');

  return (
    <div
      className="fixed top-2 left-0 w-full flex justify-center px-4 z-50 transition-all duration-100"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      <header
        className="
          w-full max-w-[90rem] mt-1 px-4 sm:px-8 py-3 
          bg-white text-black 
          rounded-full 
          border border-gray-200 
          shadow-md 
          flex items-center justify-between
        "
      >
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-bold italic cursor-pointer">
            SUPPCHECK
          </div>
        </Link>

        {/* Search Component or Magnifying Glass */}
        <div className="flex items-center">
          {isComparePage ? (
            <div className="w-48 sm:w-64 md:w-72"> {/* Responsive width */}
              <SearchComponent onProductSelect={handleProductSelect} />
            </div>
          ) : (
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-black hover:text-gray-700 p-2"
            >
              <Search size={22} />
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
