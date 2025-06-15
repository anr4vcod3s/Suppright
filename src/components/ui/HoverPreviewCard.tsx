// components/ui/HoverPreviewCard.tsx
import React, { useState, useEffect } from "react";

interface HoverPreviewCardProps {
  children: React.ReactNode;
  previewContent: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  maxWidth?: "sm" | "md" | "lg";
  delayShow?: number;
  delayHide?: number;
}

export const HoverPreviewCard: React.FC<HoverPreviewCardProps> = ({
  children,
  previewContent,
  placement = "top",
  maxWidth = "sm",
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
    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [showTimeout, hideTimeout]);

  const maxWidthClasses = {
    sm: "max-w-xs w-60", // Adjusted for typical content
    md: "max-w-sm w-72",
    lg: "max-w-md w-80",
  };

  const placementClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2.5",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2.5",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2.5",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2.5",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute z-[999] ${placementClasses[placement]} ${maxWidthClasses[maxWidth]} pointer-events-none transition-opacity duration-200 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          // Using style for smooth animation if Tailwind's animate-in is not preferred
          // style={{ transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out', opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.95)' }}
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-xl shadow-2xl p-3.5 text-sm">
            <div className="relative">{previewContent}</div>
            {/* Arrow */}
            <div
              className={`absolute w-2.5 h-2.5 bg-white/80 dark:bg-gray-900/80 border-gray-300/30 dark:border-gray-700/30 transform rotate-45 ${
                placement === "top"
                  ? "top-full left-1/2 -translate-x-1/2 -translate-y-[5px] border-t-0 border-l-0 border-r-transparent border-b-transparent"
                  : placement === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 translate-y-[5px] border-b-0 border-r-0 border-l-transparent border-t-transparent"
                  : placement === "left"
                  ? "left-full top-1/2 -translate-y-1/2 -translate-x-[5px] border-l-0 border-b-0 border-t-transparent border-r-transparent"
                  : "right-full top-1/2 -translate-y-1/2 translate-x-[5px] border-r-0 border-t-0 border-b-transparent border-l-transparent"
              }`}
              style={{
                // Ensure the border for the arrow matches the card's border for seamless look
                borderRightColor:
                  placement === "top" || placement === "bottom"
                    ? "currentColor"
                    : "transparent",
                borderBottomColor:
                  placement === "top" || placement === "bottom"
                    ? "currentColor"
                    : "transparent",
                borderLeftColor:
                  placement === "left" || placement === "right"
                    ? "currentColor"
                    : "transparent",
                borderTopColor:
                  placement === "left" || placement === "right"
                    ? "currentColor"
                    : "transparent",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverPreviewCard;