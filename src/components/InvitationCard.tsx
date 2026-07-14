"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { STUDENT, EVENT } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";

export default function InvitationCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [guestName, setGuestName] = useState("Quý Khách");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get("to") || params.get("name");
      if (toParam) {
        setGuestName(toParam);
      }
    }
  }, []);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
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

  return (
    <section className="relative py-32 px-6" id="invitation">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />

      {/* Section Title */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-accent text-sm uppercase tracking-[0.3em] mb-4">
          Kính mời
        </p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-surface">
          Thiệp Mời
        </h2>
      </motion.div>

      {/* 3D Card */}
      <motion.div
        className="max-w-lg mx-auto perspective-[1000px]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          ref={cardRef}
          className="relative rounded-3xl overflow-hidden cursor-default"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.02 }}
          transition={{ scale: { duration: 0.3 } }}
        >
          {/* Card background with glassmorphism */}
          <div className="glass rounded-3xl p-8 md:p-12 border border-accent/20 glow-accent">
            {/* Gold border frame */}
            <div className="absolute inset-3 border border-accent/10 rounded-2xl pointer-events-none" />

            {/* Top decoration */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-accent/50" />
                <Sparkles className="w-5 h-5 text-accent" />
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-accent/50" />
              </div>
            </div>

            {/* Guest Name */}
            <div className="text-center mb-8">
              <p className="text-muted text-sm mb-2">Trân trọng kính mời</p>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-gradient">
                {guestName}
              </h3>
            </div>

            {/* Divider */}
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mb-8" />

            {/* Event Details */}
            <div className="text-center mb-8">
              <p className="text-surface/80 text-sm md:text-base mb-2">
                Đến dự buổi lễ
              </p>
              <h4 className="font-heading text-xl md:text-2xl font-bold text-accent mb-1">
                {EVENT.title}
              </h4>
              <p className="text-surface text-base md:text-lg font-medium">
                {STUDENT.name}
              </p>
              <p className="text-muted text-sm mt-1">
                {STUDENT.major} — {STUDENT.university}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-light rounded-2xl p-4 text-center">
                <Calendar className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-muted text-xs uppercase tracking-wider mb-1">
                  Ngày
                </p>
                <p className="text-surface font-medium text-sm">
                  {formatDate(EVENT.date)}
                </p>
              </div>

              <div className="glass-light rounded-2xl p-4 text-center">
                <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-muted text-xs uppercase tracking-wider mb-1">
                  Thời gian
                </p>
                <p className="text-surface font-medium text-sm">
                  {EVENT.time}
                </p>
              </div>

              <div className="glass-light rounded-2xl p-4 text-center">
                <MapPin className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-muted text-xs uppercase tracking-wider mb-1">
                  Địa điểm
                </p>
                <p className="text-surface font-medium text-sm">
                  {EVENT.venue}
                </p>
              </div>
            </div>

            {/* Thank you message */}
            <div className="text-center">
              <p className="text-muted text-sm italic leading-relaxed">
                &ldquo;Sự hiện diện của Quý Khách là niềm vinh hạnh lớn lao
                đối với tôi.&rdquo;
              </p>
            </div>

            {/* Bottom decoration */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-accent/50" />
                <span className="text-accent text-xl">✦</span>
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-accent/50" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
