// src/app/layout.tsx
import '@/app/globals.css';
import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
};

export default RootLayout;
