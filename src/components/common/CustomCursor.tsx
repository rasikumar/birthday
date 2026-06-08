/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useMousePosition } from "../../hooks/useMousePosition";

interface CustomCursorProps {
  mode: "default" | "knife";
}

export default function CustomCursor({ mode }: CustomCursorProps) {
  const { x, y } = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show cursor only on mouse movement
    const handleMouseOver = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener("mouseenter", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    // Check if mouse is already in window
    if (window.innerWidth > 0) {
      setIsVisible(true);
    }

    // Monitor hover elements
    const handleMouseOverElements = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.closest(".interactive-hover") !== null)
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOverElements);

    return () => {
      document.removeEventListener("mouseenter", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOverElements);
    };
  }, []);

  if (!isVisible || mode === "knife") return null;

  return (
    <motion.div
      id="custom-cursor-container"
      className="custom-cursor fixed top-0 left-0 pointer-events-none"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Elegant Design Glow Cursor Mode */}
      <div className="relative">
        {/* Outer circle halo */}
        <motion.div
          id="cursor-ring"
          className="rounded-full border border-amber-500/60 flex items-center justify-center"
          animate={{
            width: isHovered ? 48 : 28,
            height: isHovered ? 48 : 28,
            backgroundColor: isHovered ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.0)",
            borderColor: isHovered ? "#FBBF24" : "rgba(245, 158, 11, 0.6)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />
        {/* Core shining dot */}
        <motion.div
          id="cursor-dot"
          className="absolute rounded-full bg-amber-400"
          style={{
            width: 6,
            height: 6,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            scale: isHovered ? 1.5 : 1,
          }}
        />
      </div>
    </motion.div>
  );
}
