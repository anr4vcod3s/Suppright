// src/components/Header.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchComponent } from "@/components/SearchComponent";
import { Product } from "@/lib/schemas";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle"; // Assuming ThemeToggle is created

const Header = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;

      // Only hide if not at the very top
      setVisible(currentScrollPos < 10 || !isScrollingDown);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const handleProductSelect = (product: Product) => {
    console.log("Selected product:", product);
  };

  const isComparePage =
    pathname === "/compare" || pathname.startsWith("/compare/");

  return (
    <div
      className="fixed top-2 left-0 w-full flex justify-center px-4 z-50 transition-transform duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-120%)",
      }}
    >
      <header
        className="
          w-full max-w-[90rem] mt-1 px-4 sm:px-8 py-3
          bg-background/80 text-foreground backdrop-blur-lg
          rounded-full
          border border-border
          shadow-md
          flex items-center justify-between
        "
      >
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-bold italic cursor-pointer text-foreground">
            SuppRight
          </div>
        </Link>

        {/* Search and Theme Toggle */}
        <div className="flex items-center gap-4">
          {isComparePage ? (
            <div className="w-full sm:w-64 md:w-72">
              <SearchComponent onProductSelect={handleProductSelect} />
            </div>
          ) : (
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-foreground hover:text-accent-foreground p-2"
            >
              <Search size={22} />
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>
    </div>
  );
};

export default Header;