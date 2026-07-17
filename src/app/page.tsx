"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import ParticlesWrapper from "@/components/ParticlesWrapper";
import HeroSection from "@/components/HeroSection";
import EnvelopeAnimation from "@/components/EnvelopeAnimation";
import {
  SectionDivider,
  SectionTransition,
} from "@/components/SectionTransition";
import { sfx } from "@/lib/audio";
import { Music, Sparkles, Volume2, VolumeX } from "lucide-react";

// Tải động các component bên dưới để tối ưu hóa dung lượng tải trang ban đầu (Initial Bundle Size)
const InvitationCard = dynamic(() => import("@/components/InvitationCard"), { ssr: false });
const CountdownSection = dynamic(() => import("@/components/CountdownSection"), { ssr: false });
const MapSection = dynamic(() => import("@/components/MapSection"), { ssr: false });
const FooterSection = dynamic(() => import("@/components/FooterSection"), { ssr: false });
const Fireworks = dynamic(() => import("@/components/Fireworks"), { ssr: false });

// Trạng thái hiển thị phong bì
type EnvelopeState = "showing" | "revealing" | "hidden";

export default function HomePage() {
  const [envelopeState, setEnvelopeState] = useState<EnvelopeState>("showing");
  const [guestName, setGuestName] = useState("Bạn");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.22);
  const [isFireworkMuted, setIsFireworkMuted] = useState(false);
  const [fireworkVolume, setFireworkVolume] = useState(0.22);
  const [showVolume, setShowVolume] = useState(false);
  const [showFireworkVolume, setShowFireworkVolume] = useState(false);

  const syncExplosionVolume = (nextVolume: number, nextMuted: boolean) => {
    sfx.setExplosionVolume(nextMuted || nextVolume === 0 ? 0 : Math.min(5, (nextVolume / 0.22) * 2.6));
  };

  const handleToggleMute = () => {
    const isPlaying = sfx.toggleBGM();
    const nextMuted = !isPlaying;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const nextMuted = val === 0;
    setVolume(val);
    sfx.setBGMVolume(val);
    setIsMuted(nextMuted);
  };

  const handleToggleFireworkMute = () => {
    const nextMuted = !isFireworkMuted;
    setIsFireworkMuted(nextMuted);
    syncExplosionVolume(fireworkVolume, nextMuted);
  };

  const handleFireworkVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const nextMuted = val === 0;
    setFireworkVolume(val);
    setIsFireworkMuted(nextMuted);
    syncExplosionVolume(val, nextMuted);
  };

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

              {/* Hiệu ứng pháo hoa mạ vàng bắn từ 2 bên góc dưới */}
              <Fireworks />

              {/* Hào quang nền màu ngọc - xanh ngọc công nghệ & vàng kim */}
              <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[rgba(6,182,212,0.03)] blur-[150px] pointer-events-none z-0" />
              <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[rgba(250,204,21,0.03)] blur-[150px] pointer-events-none z-0" />

              {/* Họa tiết ngắm mục tiêu HUD ở 4 góc màn hình desktop */}
              <div className="hidden lg:block fixed top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-accent/20 pointer-events-none z-50" />
              <div className="hidden lg:block fixed top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-accent/20 pointer-events-none z-50" />
              <div className="hidden lg:block fixed bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-accent/20 pointer-events-none z-50" />
              <div className="hidden lg:block fixed bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-accent/20 pointer-events-none z-50" />

              {/* Cảnh 1 — Hero Section (hiện ngay sau phong bì) */}
              <SectionTransition>
                <HeroSection showParticles={envelopeState === "hidden"} />
              </SectionTransition>

              {/* Divider */}
              <SectionDivider spacious />

              {/* Cảnh 2 — Thiệp mời chi tiết */}
              <SectionTransition>
                <InvitationCard guestName={guestName} />
              </SectionTransition>

              {/* Divider */}
              <SectionDivider />

              {/* Cảnh 3 — Đếm ngược */}
              <SectionTransition>
                <CountdownSection />
              </SectionTransition>

              {/* Divider */}
              <SectionDivider />

              {/* Cảnh 4 — Bản đồ */}
              <SectionTransition>
                <MapSection />
              </SectionTransition>

              {/* Divider */}
              <SectionDivider />

              {/* Cảnh 6 — Lời cảm ơn */}
              <SectionTransition>
                <FooterSection />
              </SectionTransition>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PHONG BÌ OVERLAY (fixed, đè lên nội dung) ── */}
        <AnimatePresence>
          {envelopeState !== "hidden" && (
            <EnvelopeAnimation
              onStartFading={(name) => {
                setGuestName(name);
                setEnvelopeState("revealing");
              }}
              onComplete={(name) => {
                setEnvelopeState("hidden");
                setGuestName(name);
              }}
            />
          )}
        </AnimatePresence>

        {/* Cụm điều khiển nhạc nền: nút Mute + Slider âm lượng popup khi hover */}
        {envelopeState !== "showing" && (
          <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2">
            <div
              className="flex items-center gap-2"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
            {/* Slider âm lượng trượt vào từ bên trái khi hover */}
            <AnimatePresence>
              {showVolume && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 130, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center gap-2 overflow-hidden rounded-full border border-[#D4AF37]/35 bg-[#070c15]/75 backdrop-blur-md px-3 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.5),_0_0_10px_rgba(212,175,55,0.15)]"
                >
                  {/* Icon âm lượng nhỏ */}
                  {volume === 0 || isMuted
                    ? <VolumeX className="w-3.5 h-3.5 text-[#FFF099]/60 flex-shrink-0" />
                    : <Volume2 className="w-3.5 h-3.5 text-[#FFF099]/70 flex-shrink-0" />
                  }

                  {/* Track thanh slider tùy chỉnh */}
                  <div className="relative flex-1 h-1.5">
                    <div className="absolute inset-0 rounded-full bg-white/10" />
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFF099] transition-all"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Hiển thị phần trăm âm lượng */}
                  <span className="text-[10px] text-[#D4AF37]/80 w-6 text-right flex-shrink-0">
                    {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nút nhạc chính */}
            <motion.button
              id="bgm-toggle-btn"
              onClick={handleToggleMute}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-[#D4AF37]/35 bg-[#070c15]/65 backdrop-blur-md text-[#FFF099] shadow-[0_4px_16px_rgba(0,0,0,0.5),_0_0_12px_rgba(212,175,55,0.2)] focus:outline-none focus:border-[#D4AF37] pointer-events-auto cursor-pointer relative flex-shrink-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
              whileHover={{ scale: 1.08, borderColor: "rgba(212, 175, 55, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Vòng sóng âm nhấp nháy khi đang phát nhạc */}
              {!isMuted && (
                <>
                  <span className="absolute inset-0 rounded-full border border-[#D4AF37]/40 animate-ping opacity-60 pointer-events-none" />
                  <span className="absolute -inset-2 rounded-full border border-[#D4AF37]/20 animate-ping opacity-30 pointer-events-none" style={{ animationDelay: "0.4s" }} />
                </>
              )}

              {/* Icon nốt nhạc xoay tròn khi phát nhạc */}
              <motion.div
                animate={!isMuted ? { rotate: 360 } : { rotate: 0 }}
                transition={!isMuted ? { duration: 6, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                className="relative w-5 h-5 flex items-center justify-center"
              >
                <Music className="w-5 h-5" />
                {isMuted && (
                  <div className="absolute w-[22px] h-[1.8px] bg-[#FF4D4F] rotate-45 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
                )}
              </motion.div>
            </motion.button>
            </div>

            <div
              className="flex items-center gap-2"
              onMouseEnter={() => setShowFireworkVolume(true)}
              onMouseLeave={() => setShowFireworkVolume(false)}
            >
              <AnimatePresence>
                {showFireworkVolume && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 130, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-center gap-2 overflow-hidden rounded-full border border-[#D4AF37]/35 bg-[#070c15]/75 backdrop-blur-md px-3 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.5),_0_0_10px_rgba(212,175,55,0.15)]"
                  >
                    {fireworkVolume === 0 || isFireworkMuted
                      ? <VolumeX className="w-3.5 h-3.5 text-[#FFF099]/60 flex-shrink-0" />
                      : <Volume2 className="w-3.5 h-3.5 text-[#FFF099]/70 flex-shrink-0" />
                    }

                    <div className="relative flex-1 h-1.5">
                      <div className="absolute inset-0 rounded-full bg-white/10" />
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#06B6D4] to-[#FFF099] transition-all"
                        style={{ width: `${(isFireworkMuted ? 0 : fireworkVolume) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.02"
                        value={isFireworkMuted ? 0 : fireworkVolume}
                        onChange={handleFireworkVolumeChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    <span className="text-[10px] text-[#D4AF37]/80 w-6 text-right flex-shrink-0">
                      {isFireworkMuted ? "0%" : `${Math.round(fireworkVolume * 100)}%`}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                id="firework-sfx-toggle-btn"
                onClick={handleToggleFireworkMute}
                className="flex items-center justify-center w-11 h-11 rounded-full border border-[#D4AF37]/35 bg-[#070c15]/65 backdrop-blur-md text-[#FFF099] shadow-[0_4px_16px_rgba(0,0,0,0.5),_0_0_12px_rgba(6,182,212,0.2)] focus:outline-none focus:border-[#D4AF37] pointer-events-auto cursor-pointer relative flex-shrink-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.95 }}
                whileHover={{ scale: 1.08, borderColor: "rgba(212, 175, 55, 0.6)" }}
                whileTap={{ scale: 0.95 }}
              >
                {!isFireworkMuted && (
                  <>
                    <span className="absolute inset-0 rounded-full border border-[#06B6D4]/40 animate-ping opacity-50 pointer-events-none" />
                    <span className="absolute -inset-2 rounded-full border border-[#D4AF37]/20 animate-ping opacity-25 pointer-events-none" style={{ animationDelay: "0.4s" }} />
                  </>
                )}

                <motion.div
                  animate={!isFireworkMuted ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={!isFireworkMuted ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                  className="relative w-5 h-5 flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5" />
                  {isFireworkMuted && (
                    <div className="absolute w-[22px] h-[1.8px] bg-[#FF4D4F] rotate-45 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        )}
      </main>
    </ParticlesWrapper>
  );
}
