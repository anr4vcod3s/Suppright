// src/app/layout.tsx
"use client";

import "@/app/globals.css";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComparisonProvider } from "@/context/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: ReactNode }) {
  // Create a client
  const queryClient = new QueryClient();

  return (
    // The space between <html...> and <body> has been removed.
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <ComparisonProvider>
              <Header />
              <main>{children}
                <Analytics/>
                <SpeedInsights/>
              </main>
              <Footer />
            </ComparisonProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}