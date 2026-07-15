"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { STUDENT } from "@/lib/constants";
import { Heart } from "lucide-react";

export default function FooterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const fireFooterConfetti = useCallback(() => {
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ["#FACC15", "#F59E0B", "#FDE68A", "#F8FAFC", "#EAB308"],
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(fireFooterConfetti, 500);
      return () => clearTimeout(timeout);
    }
  }, [isInView, fireFooterConfetti]);

  return (
    <footer
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      id="footer"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary-light/10 to-primary" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Graduation Cap Toss */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="text-5xl md:text-7xl"
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={
                  isInView
                    ? {
                      y: [-20, -150, -300],
                      rotate: [0, 180, 360],
                      opacity: [1, 1, 0],
                    }
                    : {}
                }
                transition={{
                  duration: 2.5,
                  delay: i * 0.2,
                  ease: "easeOut",
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                🎓
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-gradient mb-6 leading-tight">
            Cảm ơn các bạn
          </h2>

          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mb-6" />

          <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Mỗi khoảnh khắc, mỗi kỷ niệm đều trở thành hành trang quý giá trên
            con đường phía trước. Xin gửi lời tri ân sâu sắc đến tất cả mọi
            người.
          </p>

          <div className="flex items-center justify-center gap-2 text-accent">

            <Heart className="w-4 h-4 fill-accent text-accent animate-pulse-slow" />
          </div>

          <p className="font-heading text-xl md:text-2xl font-bold text-surface mt-4">
            {STUDENT.name}
          </p>
        </motion.div>

        {/* Bottom line */}
        <motion.div
          className="mt-20 pt-8 border-t border-surface/5"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <p className="text-muted/30 text-xs">
            Thiệp mời tốt nghiệp — {STUDENT.university} — {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
