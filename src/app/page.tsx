"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticlesWrapper from "@/components/ParticlesWrapper";
import HeroSection from "@/components/HeroSection";
import EnvelopeAnimation from "@/components/EnvelopeAnimation";
import InvitationCard from "@/components/InvitationCard";
import CountdownSection from "@/components/CountdownSection";
import MapSection from "@/components/MapSection";
import WishSection from "@/components/WishSection";
import FooterSection from "@/components/FooterSection";

// Trạng thái hiển thị phong bì
type EnvelopeState = "showing" | "revealing" | "hidden";

export default function HomePage() {
  const [envelopeState, setEnvelopeState] = useState<EnvelopeState>("showing");

  return (
    <ParticlesWrapper>
      <main className="relative">
        {/* ── NỘI DUNG CHÍNH ──
            Luôn được render nhưng ẩn khi phong bì đang hiển thị.
            Khi phong bì bắt đầu fade (onStartFading) → nội dung dần hiện ra phía sau.
            Khi phong bì biến mất (onComplete) → nội dung hoàn toàn rõ nét.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              envelopeState === "showing"
                ? 0
                : envelopeState === "revealing"
                ? 0.25        // mờ mờ thấy phía sau phong bì
                : 1,          // hoàn toàn rõ
          }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          {/* Cảnh 1 — Hero Section (hiện ngay sau phong bì) */}
          <HeroSection />

          {/* Divider */}
          <div className="relative h-20">
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          </div>

          {/* Cảnh 2 — Thiệp mời chi tiết */}
          <InvitationCard />

          {/* Divider */}
          <div className="relative h-16">
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          </div>

          {/* Cảnh 3 — Đếm ngược */}
          <CountdownSection />

          {/* Divider */}
          <div className="relative h-16">
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          </div>

          {/* Cảnh 4 — Bản đồ */}
          <MapSection />

          {/* Divider */}
          <div className="relative h-16">
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          </div>

          {/* Cảnh 5 — Lời chúc */}
          <WishSection />

          {/* Cảnh 6 — Lời cảm ơn */}
          <FooterSection />
        </motion.div>

        {/* ── PHONG BÌ OVERLAY (fixed, đè lên nội dung) ── */}
        <AnimatePresence>
          {envelopeState !== "hidden" && (
            <EnvelopeAnimation
              onStartFading={() => setEnvelopeState("revealing")}
              onComplete={() => setEnvelopeState("hidden")}
            />
          )}
        </AnimatePresence>
      </main>
    </ParticlesWrapper>
  );
}
