"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
}

export function SectionTransition({
  children,
  className = "",
}: SectionTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 92%", "end 8%"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.78, 1],
    [0.2, 1, 1, 0.28],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.16, 0.78, 1],
    [0.965, 1, 1, 0.965],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.16, 0.78, 1],
    [28, 0, 0, -20],
  );
  const filter = useTransform(
    scrollYProgress,
    [0, 0.16, 0.78, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(6px)"],
  );

  return (
    <motion.div
      ref={sectionRef}
      className={`relative transform-gpu ${className}`}
      style={
        shouldReduceMotion
          ? undefined
          : {
              opacity,
              scale,
              y,
              filter,
              willChange: "transform, opacity, filter",
            }
      }
    >
      {children}
    </motion.div>
  );
}

interface SectionDividerProps {
  spacious?: boolean;
}

export function SectionDivider({ spacious = false }: SectionDividerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative flex items-center justify-center px-6 ${
        spacious ? "h-20" : "h-16"
      }`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-px w-[min(72rem,calc(100%-3rem))] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
      />

      <motion.div
        className="relative h-2 w-2 rotate-45 border border-accent/45 bg-primary shadow-[0_0_14px_rgba(250,204,21,0.25)]"
        initial={shouldReduceMotion ? false : { scale: 0, rotate: 45 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
          delay: 0.35,
        }}
      />
    </div>
  );
}
