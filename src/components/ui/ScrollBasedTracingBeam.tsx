// components/ui/ScrollBasedTracingBeam.tsx
"use client";
import React, { useEffect,  useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollBasedTracingBeamProps {
  targetRef: React.RefObject<HTMLDivElement>;
  className?: string;
  beamGradient?: string;
  beamHeightPercentage?: number;
}

export const ScrollBasedTracingBeam: React.FC<ScrollBasedTracingBeamProps> = ({
  targetRef,
  className = "",
  beamGradient = "linear-gradient(to bottom, transparent, #A855F7 30%, #F472B6 50%, #A855F7 70%, transparent)",
  beamHeightPercentage = 0.25,
}) => {
  const [beamY, setBeamY] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [dynamicBeamHeight, setDynamicBeamHeight] = useState(0);

  useEffect(() => {
    const targetElement = targetRef.current;
    if (!targetElement) return;

    const handleScroll = () => {
      const rect = targetElement.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setIsInView(isVisible);

      const newDynamicHeight = rect.height * beamHeightPercentage;
      setDynamicBeamHeight(newDynamicHeight);

      if (isVisible) {
        // Corrected progress calculation for full travel distance
        const progress =
          (window.innerHeight - rect.top) /
          (window.innerHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, progress));

        const newY = clampedProgress * (rect.height - newDynamicHeight);
        setBeamY(newY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(targetElement);

    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [targetRef, beamHeightPercentage]);

  return (
    <AnimatePresence>
      {isInView && (
        <div
          className={`absolute top-0 left-0 h-full w-1.5 pointer-events-none ${className}`}
          style={{ zIndex: 25 }}
        >
          <motion.div
            className="absolute left-0 w-full"
            style={{
              height: `${dynamicBeamHeight}px`,
              background: beamGradient,
              maskImage:
                "radial-gradient(ellipse 50% 100% at 50% 50%, black 5%, transparent 60%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 50% 100% at 50% 50%, black 5%, transparent 60%)",
              filter: "drop-shadow(0 0 0.75rem #A855F7)",
            }}
            initial={{ opacity: 0, y: beamY }}
            animate={{ opacity: 1, y: beamY }}
            exit={{ opacity: 0 }}
            transition={{
              // Switched to a responsive spring animation
              y: { type: "spring", stiffness: 600, damping: 60 },
              opacity: { duration: 0.1 },
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};