"use client";

import '@/app/globals.css';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComparisonProvider } from '@/context/context';
import Header from '@/components/Header';

export default function RootLayout({ children }: { children: ReactNode }) {
  // Create a client
  const queryClient = new QueryClient();
  
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ComparisonProvider>
            <Header />
            <main>
              {children}
            </main>
          </ComparisonProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}