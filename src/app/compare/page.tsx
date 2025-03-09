// app/compare/page.tsx
'use client';

import React from 'react';
import CompareTableComponent from '@/components/ComparisonTable';

const ComparePage = () => {
  return (
    <div className="max-w-7xl mx-auto items-center pt-20">
      <CompareTableComponent />

    </div>
    
  );
};

export default ComparePage;