// components/ui/HoverInfoCard.tsx
"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface HoverInfoCardProps {
  children: React.ReactNode;
  infoContent: React.ReactNode;
  placement?: "top" | "bottom";
  delay?: number;
}

export const HoverInfoCard: React.FC<HoverInfoCardProps> = ({
  children,
  infoContent,
  placement = "top",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 300, damping: 20 };
  const x = useMotionValue(0);
  const rotate = useSpring(useMotionValue(0), springConfig);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
    rotate.set(-x.get() / halfWidth / 2); // Subtle rotation effect
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        rotate.set(0);
      }}
      onMouseMove={handleMouseMove}
    >
      <motion.div style={{ rotate }}>{children}</motion.div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: placement === "top" ? 10 : -10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
            exit={{
              opacity: 0,
              y: placement === "top" ? 10 : -10,
              transition: { duration: 0.2 },
            }}
            className={`absolute z-[9999] w-64 ${
              placement === "top"
                ? "bottom-full left-1/2 -translate-x-1/2 pb-3"
                : "top-full left-1/2 -translate-x-1/2 pt-3"
            } pointer-events-none`}
          >
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-xl shadow-2xl p-4 text-sm">
              {infoContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverInfoCard;