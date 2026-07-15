"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import ParticlesWrapper from "@/components/ParticlesWrapper";
import HeroSection from "@/components/HeroSection";
import EnvelopeAnimation from "@/components/EnvelopeAnimation";

// Tải động các component bên dưới để tối ưu hóa dung lượng tải trang ban đầu (Initial Bundle Size)
const InvitationCard = dynamic(() => import("@/components/InvitationCard"), { ssr: false });
const CountdownSection = dynamic(() => import("@/components/CountdownSection"), { ssr: false });
const MapSection = dynamic(() => import("@/components/MapSection"), { ssr: false });
const WishSection = dynamic(() => import("@/components/WishSection"), { ssr: false });
const FooterSection = dynamic(() => import("@/components/FooterSection"), { ssr: false });

// Trạng thái hiển thị phong bì
type EnvelopeState = "showing" | "revealing" | "hidden";

export default function HomePage() {
  const [envelopeState, setEnvelopeState] = useState<EnvelopeState>("showing");

  return (
    <ParticlesWrapper>
      <main className="relative">
        {/* ── NỘI DUNG CHÍNH ──
            Chỉ gắn vào DOM sau khi phong bì bắt đầu mở (envelopeState !== "showing").
            Điều này giúp tối ưu hóa hiệu năng CPU và RAM của thiết bị bằng cách trì hoãn
            việc dựng giao diện bản đồ, bộ đếm ngược, và chạy các script hiệu ứng khác.
        */}
        <AnimatePresence>
          {envelopeState !== "showing" && (
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="relative min-h-screen overflow-hidden"
            >
              {/* Lớp lưới công nghệ tương lai */}
              <div className="absolute inset-0 tech-grid pointer-events-none z-0" />

              {/* Đường quét Laser dọc màn hình */}
              <div className="laser-scanner" />

              {/* Hào quang nền màu ngọc - xanh ngọc công nghệ & vàng kim */}
              <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[rgba(6,182,212,0.03)] blur-[150px] pointer-events-none z-0" />
              <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[rgba(250,204,21,0.03)] blur-[150px] pointer-events-none z-0" />

              {/* Họa tiết ngắm mục tiêu HUD ở 4 góc màn hình desktop */}
              <div className="hidden lg:block fixed top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-accent/20 pointer-events-none z-50" />
              <div className="hidden lg:block fixed top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-accent/20 pointer-events-none z-50" />
              <div className="hidden lg:block fixed bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-accent/20 pointer-events-none z-50" />
              <div className="hidden lg:block fixed bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-accent/20 pointer-events-none z-50" />

              {/* Cảnh 1 — Hero Section (hiện ngay sau phong bì) */}
              <HeroSection showParticles={envelopeState === "hidden"} />

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



              {/* Cảnh 6 — Lời cảm ơn */}
              <FooterSection />
            </motion.div>
          )}
        </AnimatePresence>

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
