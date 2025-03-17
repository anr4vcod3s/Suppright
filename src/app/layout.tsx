import '@/app/globals.css';
import { ReactNode } from 'react';
import { ComparisonProvider } from '@/context/context';
import Header from '@/components/Header';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ComparisonProvider>
          <Header />
          <main>
            {children}
          </main>
        </ComparisonProvider>
      </body>
    </html>
  );
}