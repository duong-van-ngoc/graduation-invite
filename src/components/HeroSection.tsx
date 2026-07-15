"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Cpu, Terminal, GraduationCap } from "lucide-react";
import ParticlesBackground from "./ParticlesBackground";
import { STUDENT } from "@/lib/constants";
import {
  fadeIn,
  staggerContainer,
  staggerItem,
  scaleIn,
} from "@/lib/animation";

interface HeroSectionProps {
  showParticles?: boolean;
}

export default function HeroSection({ showParticles = false }: HeroSectionProps) {
  const fullText = `Lễ Tốt Nghiệp của ${STUDENT.name}`;

  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeCharacter = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));

        currentIndex++;

        // Gõ chậm lúc đầu, nhanh hơn về sau
        const speed = currentIndex < 6 ? 110 : 55;

        timeoutId = setTimeout(typeCharacter, speed);
      } else {
        setTimeout(() => {
          setShowCursor(false);
        }, 1000);
      }
    };

    typeCharacter();

    return () => clearTimeout(timeoutId);
  }, [fullText]);

  const handleScrollToCard = () => {
    const cardElement = document.getElementById("invitation");
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Background */}
      {showParticles && <ParticlesBackground />}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary to-primary z-[1]" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] z-[1]" />

      {/* Vòng tròn công nghệ đồng tâm xoay chậm phong cách tương lai */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] pointer-events-none opacity-20 z-[1] select-none">
        <svg className="w-full h-full animate-[spin_180s_linear_infinite]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="95" stroke="rgba(250, 204, 21, 0.12)" strokeWidth="0.4" fill="none" strokeDasharray="3, 6" />
          <circle cx="100" cy="100" r="80" stroke="rgba(250, 204, 21, 0.08)" strokeWidth="0.5" fill="none" strokeDasharray="20, 8, 4, 8" />
          <circle cx="100" cy="100" r="65" stroke="rgba(250, 204, 21, 0.15)" strokeWidth="0.3" fill="none" />
          <circle cx="100" cy="100" r="50" stroke="rgba(250, 204, 21, 0.1)" strokeWidth="0.6" fill="none" strokeDasharray="1, 4" />
        </svg>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] pointer-events-none opacity-15 z-[1] select-none">
        <svg className="w-full h-full animate-[spin_100s_linear_infinite_reverse]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" stroke="rgba(250, 204, 21, 0.08)" strokeWidth="0.4" fill="none" strokeDasharray="15, 10" />
          <circle cx="100" cy="100" r="72" stroke="rgba(250, 204, 21, 0.12)" strokeWidth="0.3" fill="none" strokeDasharray="40, 5" />
        </svg>
      </div>

      {/* Side tech indicators */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 opacity-30 select-none pointer-events-none font-mono text-[10px] tracking-[0.25em] text-accent/80 z-20">
        <p className="[writing-mode:vertical-lr] uppercase mb-4">SYSTEM ID: PKA_GRADUATE_2026</p>
        <div className="w-[1px] h-24 bg-gradient-to-b from-accent/50 to-transparent mx-auto" />
      </div>
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-30 select-none pointer-events-none font-mono text-[10px] tracking-[0.25em] text-accent/80 z-20">
        <div className="w-[1px] h-24 bg-gradient-to-t from-accent/50 to-transparent mx-auto mb-4" />
        <p className="[writing-mode:vertical-lr] uppercase">STATUS: ACTIVE // CONFIRMED_OK</p>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-40 text-center px-6 max-w-4xl mx-auto flex flex-col items-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── 1. AVATAR SECTION WITH HUD ROTATING RING ── */}
        <div className="relative w-36 h-36 md:w-40 md:h-40 flex items-center justify-center mb-8">
          {/* Vòng quay HUD phía sau */}
          <div className="absolute inset-0 pointer-events-none animate-[spin_40s_linear_infinite] select-none opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" stroke="#FACC15" strokeWidth="0.5" fill="none" strokeDasharray="10, 15, 30, 15" />
              <circle cx="50" cy="50" r="45" stroke="rgba(250, 204, 21, 0.3)" strokeWidth="0.3" fill="none" strokeDasharray="2, 5" />
            </svg>
          </div>

          {/* Khung ảnh tỏa sáng */}
          <motion.div
            variants={scaleIn}
            className="w-[86%] h-[86%] rounded-full p-[3px] bg-gradient-to-br from-accent via-accent-dark to-transparent glow-accent relative z-10"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary bg-primary-light">
              <img
                src={STUDENT.avatar}
                alt={STUDENT.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>




        </div>

        {/* ── 2. UNIVERSITY NAME ── */}
        <motion.p
          variants={staggerItem}
          className="text-accent/80 text-sm md:text-base uppercase tracking-[0.35em] mb-4 font-body font-light"
        >
          {STUDENT.university}
        </motion.p>

        {/* ── 3. TYPING TITLE ── */}
        <motion.div
          className="mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gradient tracking-wide">
            {displayText}
            {showCursor && (
              <motion.span
                className="inline-block ml-1 text-accent font-light"
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                |
              </motion.span>
            )}
          </h1>
        </motion.div>

        {/* ── 4. CYBER INFO CARDS (Tech-HUD cards) ── */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-16 px-4 z-10"
        >
          {/* Card 1: Chuyên ngành */}

        </motion.div>

        {/* ── 5. SCROLL GUIDE (Futuristic Mouse scroll indicator) ── */}
        <motion.div
          variants={fadeIn}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-40"
          onClick={handleScrollToCard}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-muted/60 font-body select-none">Cuộn xuống</span>
          <div className="w-[20px] h-[34px] rounded-full border border-accent/30 flex justify-center p-1.5">
            <motion.div
              className="w-1 h-1 rounded-full bg-accent"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
