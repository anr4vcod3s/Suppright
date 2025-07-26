// components/utils/LazyLoadWrapper.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  placeholder: React.ReactNode;
  rootMargin?: string;
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  placeholder,
  rootMargin = "100px",
}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return <div ref={ref}>{isInView ? children : placeholder}</div>;
};