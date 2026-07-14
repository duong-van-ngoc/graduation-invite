"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { EVENT } from "@/lib/constants";
import { Timer } from "lucide-react";

export default function CountdownSection() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(EVENT.date);

  const timeBlocks = [
    { label: "Ngày", value: days },
    { label: "Giờ", value: hours },
    { label: "Phút", value: minutes },
    { label: "Giây", value: seconds },
  ];

  return (
    <section className="relative py-32 px-6" id="countdown">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary-light/20 to-primary" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Timer className="w-5 h-5 text-accent" />
            <p className="text-accent text-sm uppercase tracking-[0.3em]">
              Đếm ngược
            </p>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-surface mb-4">
            {isExpired ? "Ngày trọng đại đã đến!" : "Còn bao lâu nữa?"}
          </h2>
          <p className="text-muted max-w-md mx-auto">
            {isExpired
              ? "Cảm ơn bạn đã đồng hành!"
              : "Đếm ngược đến khoảnh khắc vinh quang"}
          </p>
        </motion.div>

        {/* Countdown Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          }}
        >
          {timeBlocks.map((block, index) => (
            <motion.div
              key={block.label}
              className="glass rounded-3xl p-6 md:p-8 text-center border border-accent/10 hover:border-accent/30 transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              {/* Number with flip animation */}
              <div className="relative h-16 md:h-20 flex items-center justify-center overflow-hidden mb-3">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={block.value}
                    className="font-heading text-4xl md:text-6xl font-bold text-gradient"
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ perspective: "600px" }}
                  >
                    {String(block.value).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Label */}
              <p className="text-muted text-xs md:text-sm uppercase tracking-wider">
                {block.label}
              </p>

              {/* Subtle glow line */}
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto mt-4" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
