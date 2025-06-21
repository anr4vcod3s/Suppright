"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchComponent } from "@/components/SearchComponent";
import { Product } from "@/lib/schemas";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;
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
      className="fixed top-1 left-0 w-full px-2 sm:px-4 z-50 transition-transform duration-300"
      style={{ transform: visible ? "translateY(0)" : "translateY(-120%)" }}
    >
      <header
        className="
          md:w-10/12 mx-auto flex items-center
          justify-between space-x-2 sm:space-x-3
          px-2 sm:px-4 py-1.5 sm:py-2
          bg-background/80 backdrop-blur-lg
          rounded-full border border-border shadow-sm
        "
      >
        {/* Logo */}
        <Link href="/">
          <div className="text-base sm:text-xl font-semibold italic cursor-pointer text-foreground">
            SuppRight
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search or Button & Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isComparePage ? (
            <div className="w-full sm:w-64 md:w-72">
              <SearchComponent onProductSelect={handleProductSelect} />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Scroll to top / Search"
              className="relative h-10 w-10 rounded-full border 
                         text-foreground border-foreground/30 
                         hover:border-foreground/50 transition-colors"
            >
              <Search />
            </Button>
          )}

          <ThemeToggle />
        </div>
      </header>
    </div>
  );
};

export default Header;
