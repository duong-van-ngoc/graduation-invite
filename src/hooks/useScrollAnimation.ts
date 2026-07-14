"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  toggleActions?: string;
  markers?: boolean;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  stagger?: number;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      start = "top 85%",
      end = "bottom 20%",
      toggleActions = "play none none reverse",
      from = { opacity: 0, y: 60 },
      stagger = 0,
    } = options;

    const children = stagger > 0 ? element.children : [element];

    const ctx = gsap.context(() => {
      gsap.from(children, {
        ...from,
        duration: 1,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          toggleActions,
        },
      });
    }, element);

    return () => ctx.revert();
  }, [options]);

  return ref;
}

// Hook for parallax effect
export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -30 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, element);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

// Hook for timeline line glow animation
export function useTimelineGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: element.parentElement,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, []);

  return ref;
}
