// src/components/HeroComponent.tsx
import React from 'react';
import {BackgroundBeams} from '@/components/ui/background-beams';
import {SearchComponent} from '@/components/SearchComponent';

const HeroComponent = () => {
  return (
    <div className="relative w-full h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
      <BackgroundBeams className="absolute inset-0 w-full h-full -z-10" />
      <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
        Discover and Compare Products
      </h1>
      <p className="text-lg md:text-2xl text-black mb-6">
        Find the best products tailored just for you
      </p>
      <SearchComponent />
    </div>
  );
};

export default HeroComponent;

