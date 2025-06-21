"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
      className="
        relative 
        h-10 w-10         /* mobile */
        md:h-12 md:w-12   /* desktop */
        rounded-full border 
        text-foreground border-foreground/30 
        hover:border-foreground/50 
        transition-colors
      "
    >
      <Sun
        className="
          h-2 w-2           /* mobile */
          md:h-6 md:w-6     /* desktop */
          rotate-0 scale-100 
          transition-all 
          dark:-rotate-90 dark:scale-0
        "
      />
      <Moon
        className="
          absolute 
          h-3 w-3           /* mobile */
          md:h-6 md:w-6     /* desktop */
          rotate-90 scale-0
          transition-all 
          dark:rotate-0 dark:scale-100
        "
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}