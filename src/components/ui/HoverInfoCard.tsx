// components/ui/ShimmeringHoverInfoCard.tsx
"use client";

import React, { useState, useEffect } from "react";

interface ShimmeringHoverInfoCardProps {
  children: React.ReactNode;
  infoContent: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delayShow?: number;
  delayHide?: number;
}

export const ShimmeringHoverInfoCard: React.FC<
  ShimmeringHoverInfoCardProps
> = ({
  children,
  infoContent,
  placement = "top",
  delayShow = 150,
  delayHide = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delayShow);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, delayHide);
    setHideTimeout(timeout);
  };

  useEffect(() => {
    // Cleanup timeouts on component unmount
    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [showTimeout, hideTimeout]);

  const placementClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* These classes create the moving animation */}
      <span
        className="font-semibold text-transparent bg-clip-text 
                   animate-shimmer 
                   bg-[200%_auto] 
                   bg-[linear-gradient(110deg,theme(colors.slate.900)_40%,theme(colors.red.500)_50%,theme(colors.slate.900)_60%)] 
                   dark:bg-[linear-gradient(110deg,theme(colors.white)_40%,theme(colors.red.500)_50%,theme(colors.white)_60%)]"
      >
        {children}
      </span>

      {/* Hover Card */}
      {isVisible && (
        <div
          className={`absolute z-[999] w-64 ${placementClasses[placement]} pointer-events-none transition-opacity duration-200 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-xl shadow-2xl p-4 text-sm">
            {infoContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShimmeringHoverInfoCard;