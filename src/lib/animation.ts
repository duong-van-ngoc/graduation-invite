import type { Variants, Transition } from "framer-motion";

// ── Transition Presets ──
export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

export const smoothTransition: Transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1],
};

export const slowTransition: Transition = {
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1],
};

// ── Fade In Variants ──
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Scale Variants ──
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

// ── Stagger Container ──
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ── Stagger Item ──
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Parallax ──
export const parallax = (offset: number = 50): Variants => ({
  hidden: { y: offset },
  visible: {
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
});

// ── Envelope Animations ──
export const envelopeAppear: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14,
    },
  },
};

export const envelopeFlapOpen: Variants = {
  closed: { rotateX: 0 },
  open: {
    rotateX: -180,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

export const cardSlideUp: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: -20,
    opacity: 1,
    transition: {
      delay: 0.6,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ── 3D Tilt ──
export const tilt3d = (rotateX: number, rotateY: number) => ({
  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
  transition: { duration: 0.3, ease: "easeOut" },
});

// ── Flip Counter ──
export const flipIn: Variants = {
  initial: {
    rotateX: -90,
    opacity: 0,
  },
  animate: {
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    rotateX: 90,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// ── Wish Card ──
export const wishCardAppear: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

// ── Cap Toss ──
export const capToss: Variants = {
  initial: { y: 0, rotate: 0, opacity: 1 },
  animate: {
    y: [-50, -250, -400],
    rotate: [0, 180, 360],
    opacity: [1, 1, 0],
    transition: {
      duration: 2,
      ease: "easeOut",
      times: [0, 0.5, 1],
    },
  },
};

// ── Section reveal (used with GSAP ScrollTrigger) ──
export const GSAP_DEFAULTS = {
  scrollTrigger: {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
  },
  from: {
    opacity: 0,
    y: 60,
    duration: 1,
    ease: "power3.out",
  },
  stagger: 0.15,
} as const;
