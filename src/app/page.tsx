"use client";
import HeroComponent from '@/components/HeroComponent'; 
import ComparisonDisplay from '@/components/ComparisonDisplay'; 
import { ComparisonProvider } from '@/context/context';
const HomePage = () => {
  return (
    <ComparisonProvider>
      <main className="pt-20 flex flex-col pb-36 items-center">
        <HeroComponent />
        <ComparisonDisplay />
      </main>
    </ComparisonProvider>
  );
};

export default HomePage;