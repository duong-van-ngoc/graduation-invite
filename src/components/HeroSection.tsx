"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import ParticlesBackground from "./ParticlesBackground";
import { STUDENT } from "@/lib/constants";
import {
  fadeIn,
  fadeInUp,
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

  const sentenceVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

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

      {/* Content */}
      <motion.div
        className="relative z-40 text-center px-6 max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar and Logo Section */}
        <div className="flex flex-col items-center gap-6 mb-6">
          <motion.div
            variants={scaleIn}
            className="relative w-32 h-32 md:w-36 md:h-36 rounded-full p-[3px] bg-gradient-to-br from-accent via-accent-dark to-transparent glow-accent"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary bg-primary-light">
              <img
                src={STUDENT.avatar}
                alt={STUDENT.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Small floating University Logo */}
            <div className="absolute -bottom-1 -right-1 w-11 h-11 rounded-full bg-primary p-[2px] border border-accent/40 shadow-lg flex items-center justify-center">
              <img
                src={STUDENT.logo}
                alt={STUDENT.universityShort}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* University Name */}
        <motion.p
          variants={staggerItem}
          className="text-muted text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-body"
        >
          {STUDENT.university}
        </motion.p>

        {/* Typing Title */}
        {/* Typing Title */}
        <motion.div
          className="mb-8"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gradient">
            {displayText}

            {showCursor && (
              <motion.span
                className="inline-block ml-1 text-accent"
                animate={{
                  opacity: [1, 0, 1],
                }}
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

        {/* Student Info */}
        <motion.div
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12"
        >
          {[
            { label: "Khóa", value: STUDENT.course },
            { label: "Chuyên ngành", value: STUDENT.major },

          ].map((info) => (
            <motion.div
              key={info.label}
              variants={staggerItem}
              className="glass rounded-2xl px-6 py-3"
            >
              <p className="text-muted text-xs uppercase tracking-wider mb-1">
                {info.label}
              </p>
              <p className="text-surface font-medium text-sm md:text-base">
                {info.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}


        {/* Scroll indicator */}
        <motion.div
          variants={fadeIn}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-muted/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
