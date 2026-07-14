"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import ParticlesBackground from "./ParticlesBackground";
import { STUDENT } from "@/lib/constants";

type Phase = "idle" | "opening" | "reveal" | "done";

interface EnvelopeAnimationProps {
  onComplete: () => void;
}

export default function EnvelopeAnimation({ onComplete }: EnvelopeAnimationProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect on hover (only active in idle phase)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "idle") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const startOpening = () => {
    if (phase !== "idle") return;
    setPhase("opening");

    // Sequence timeouts
    const t1 = setTimeout(() => setPhase("reveal"), 800);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  const isFlapped = phase === "opening" || phase === "reveal" || phase === "done";
  const isRevealed = phase === "reveal" || phase === "done";
  const isVisible = phase !== "done";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        >
          {/* Sparkles background */}
          <ParticlesBackground />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-primary/85 z-[1]" />

          {/* Envelope Card */}
          <motion.div
            ref={containerRef}
            className="relative z-10 w-[340px] h-[220px] md:w-[500px] md:h-[320px]"
            style={
              phase === "idle"
                ? {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }
                : { transformStyle: "preserve-3d" }
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={startOpening}
            initial={{ scale: 0.8, opacity: 0, rotate: 3 }}
            animate={
              phase === "idle"
                ? { scale: 1, opacity: 1, rotate: 3 }
                : phase === "reveal"
                  ? { scale: 0.9, y: 50, transition: { duration: 0.8 } }
                  : { scale: 1, opacity: 1 }
            }
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            whileHover={phase === "idle" ? { scale: 1.03 } : {}}
          >
            {/* ENVELOPE BACK BODY (Cream Paper background) */}
            <div
              className="absolute inset-0 bg-[#FDFBF7] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-[#E2D8C5] overflow-hidden z-0"
              style={{ transform: "translateZ(0px)" }}
            >
              {/* Subtle paper grain texture */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* CARD INSIDE ENVELOPE (Slides out upwards) */}
            <motion.div
              className="absolute left-[8%] right-[8%] bottom-[8%] top-[8%] glass rounded-xl border border-accent/30 flex flex-col items-center justify-center p-6 text-center shadow-xl z-10"
              style={{ translateZ: "5px" }}
              animate={isRevealed ? { y: -220, scale: 1.05 } : { y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-3xl mb-1">🎓</span>
              <h4 className="text-accent font-heading text-lg md:text-xl font-bold uppercase tracking-wider mb-1">
                Lễ Tốt Nghiệp
              </h4>
              <p className="text-surface/70 text-xs md:text-sm">Trân trọng kính mời</p>
              <p className="text-surface font-heading font-bold text-base md:text-lg mt-1 text-gradient">
                {STUDENT.name}
              </p>
              <div className="w-8 h-[1px] bg-accent/40 my-2" />
              <p className="text-muted text-[10px] uppercase tracking-widest">
                Đại học Phenikaa
              </p>
            </motion.div>

            {/* ENVELOPE FRONT POCKET (Covers the card when inside, card slides out from behind it) */}
            <div
              className="absolute inset-0 bg-[#FDFBF7] rounded-2xl border border-[#E2D8C5] shadow-[inset_0_4px_12px_rgba(0,0,0,0.03)] z-20 overflow-hidden pointer-events-none"
              style={{
                clipPath: "polygon(0 30%, 50% 65%, 100% 30%, 100% 100%, 0 100%)",
                WebkitClipPath: "polygon(0 30%, 50% 65%, 100% 30%, 100% 100%, 0 100%)",
                transform: "translateZ(10px)",
              }}
            >
              {/* Subtle paper grain texture */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Golden line border frame */}
              <div className="absolute inset-3 border border-[#EAB308]/40 rounded-xl" />

              {/* Text label in bottom right corner */}
              <div className="absolute bottom-6 right-8 text-right font-heading select-none">
                <p className="text-[#0F172A]/40 text-xs tracking-wider font-semibold uppercase">Graduation</p>
                <p className="text-[#0F172A]/70 text-sm font-bold tracking-wide">Invitation 2026</p>
              </div>
            </div>

            {/* ENVELOPE FLAP (Top Triangle, opens up) */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[50%] origin-top z-30 pointer-events-none"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                translateZ: "15px",
              }}
              animate={isFlapped ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Cream flap background */}
              <div className="w-full h-full bg-[#FAF7F2] border-b border-[#E2D8C5] relative">
                {/* Gold trim along triangle edges */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#EAB308]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EAB308]/40 to-transparent" />
              </div>
            </motion.div>

            {/* WAX SEAL (Maroon wax circle, positioned in center over the flap tip) */}
            <motion.div
              className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-40"
              style={{ translateZ: "20px" }}
              animate={
                isFlapped
                  ? { scale: 0, opacity: 0, y: -50 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Outer wax ring with organic irregular border */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#8b1520] to-[#51040b] shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center border border-[#400207] hover:scale-105 transition-transform duration-300">

                {/* Innermost stamp circle */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#680b13] to-[#400207] border border-[#8b1520]/30 shadow-inner flex items-center justify-center">

                  {/* Graduation cap debossed symbol */}
                  <svg
                    className="w-7 h-7 text-[#faf0e6]/70 drop-shadow-[0_-1px_1px_rgba(0,0,0,0.8)] fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                    <path d="M5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
                  </svg>
                </div>

                {/* Subtle wax shine highlight */}
                <div className="absolute top-1 left-2 w-4 h-2 bg-white/10 rounded-full rotate-[-30deg] blur-[1px]" />
              </div>

              {/* Pulsing ring instruction */}
              {phase === "idle" && (
                <span className="absolute -inset-4 rounded-full border border-[#8b1520]/45 animate-ping opacity-60 pointer-events-none" />
              )}
            </motion.div>
          </motion.div>

          {/* Hint text */}
          {phase === "idle" && (
            <motion.p
              className="absolute bottom-16 z-10 text-muted/60 text-sm tracking-widest select-none uppercase font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Chạm vào sáp niêm phong để mở
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
