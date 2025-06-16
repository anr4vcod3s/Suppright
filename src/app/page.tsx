"use client";
import HeroComponent from '@/components/HeroComponent'; 
import ComparisonDisplay from '@/components/ComparisonDisplay'; 
import { WhyTrustSuppRight } from '@/components/TrustRight';
const HomePage = () => {
  return (
      <main className="pt-20 flex flex-col pb-36 ">
        <HeroComponent />
        <WhyTrustSuppRight/>
        <ComparisonDisplay />
      </main>
  );
};

export default HomePage;