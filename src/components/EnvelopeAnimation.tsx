"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";

// Phase flow:
// idle     → phong bì xanh đen nổi, hover nghiêng 3D
// opening  → nắp phong bì mở ra (1.2s)
// glowing  → ánh vàng sáng từ bên trong phát ra (0.8s)
// fading   → phong bì mờ dần, trang chính hiện ra phía sau (1.2s)
// done     → gọi onComplete()
type Phase = "idle" | "opening" | "glowing" | "fading" | "done";

interface EnvelopeAnimationProps {
  onComplete: () => void;
  onStartFading?: () => void; // báo parent bắt đầu hiện nội dung
}

export default function EnvelopeAnimation({
  onComplete,
  onStartFading,
}: EnvelopeAnimationProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 3D tilt khi hover (chỉ idle)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 130, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 130, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-14deg", "14deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "idle") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const startOpening = () => {
    if (phase !== "idle") return;
    // Bước 1: nắp mở
    setPhase("opening");
    // Bước 2: ánh vàng sáng lên từ trong (sau 1100ms)
    setTimeout(() => setPhase("glowing"), 1100);
    // Bước 3: bắt đầu fade → báo parent hiện content (sau thêm 700ms)
    setTimeout(() => {
      setPhase("fading");
      onStartFading?.();
    }, 1800);
    // Bước 4: hoàn tất (sau thêm 1200ms fade)
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3200);
  };

  const isFlapped = phase !== "idle";
  const isGlowing = phase === "glowing" || phase === "fading" || phase === "done";
  const isFading = phase === "fading" || phase === "done";
  const isVisible = phase !== "done";

  if (!mounted) return <div className="fixed inset-0 z-50 bg-[#070C15]" />;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="envelope-overlay"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "#070C15" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isFading ? 0 : 1 }}
          transition={
            isFading
              ? { duration: 1.3, ease: "easeInOut" }
              : { duration: 0 }
          }
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Nền: hạt vàng tản mạn */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#D4AF37]"
                style={{
                  width: Math.random() * 2.5 + 0.5,
                  height: Math.random() * 2.5 + 0.5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.4 + 0.1,
                }}
                animate={{
                  opacity: [
                    Math.random() * 0.2 + 0.05,
                    Math.random() * 0.5 + 0.2,
                    Math.random() * 0.2 + 0.05,
                  ],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Ánh sáng vàng tỏa ra khi mở (background glow) */}
          <AnimatePresence>
            {isGlowing && (
              <motion.div
                key="bg-glow"
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
              >
                <div
                  className="absolute"
                  style={{
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "600px",
                    height: "400px",
                    background:
                      "radial-gradient(ellipse, rgba(212,175,55,0.18) 0%, rgba(180,120,10,0.08) 50%, transparent 70%)",
                    filter: "blur(30px)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PHONG BÌ ── */}
          <motion.div
            ref={containerRef}
            className="relative z-10 w-[340px] h-[230px] md:w-[500px] md:h-[340px] cursor-pointer select-none"
            style={
              phase === "idle"
                ? { rotateX, rotateY, transformStyle: "preserve-3d" }
                : { transformStyle: "preserve-3d" }
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={startOpening}
            initial={{ scale: 0.82, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.3 }}
            whileHover={phase === "idle" ? { scale: 1.03 } : {}}
          >
            {/* Thân phong bì — xanh đen sang trọng */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, #0F1F35 0%, #162840 40%, #0A1520 100%)",
                border: "1.5px solid rgba(212,175,55,0.35)",
                boxShadow:
                  "0 35px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.1)",
                transform: "translateZ(0px)",
              }}
            >
              {/* Họa tiết vân giấy mờ */}
              <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />
              {/* Đường gấp chéo phong bì */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 500 340"
                preserveAspectRatio="none"
              >
                {/* Bottom V-fold lines */}
                <line
                  x1="0"
                  y1="340"
                  x2="250"
                  y2="162"
                  stroke="rgba(212,175,55,0.18)"
                  strokeWidth="1.2"
                />
                <line
                  x1="500"
                  y1="340"
                  x2="250"
                  y2="162"
                  stroke="rgba(212,175,55,0.18)"
                  strokeWidth="1.2"
                />
                <line
                  x1="0"
                  y1="340"
                  x2="500"
                  y2="340"
                  stroke="rgba(212,175,55,0.12)"
                  strokeWidth="1"
                />
              </svg>
              {/* Viền vàng bên trong */}
              <div
                className="absolute rounded-xl pointer-events-none"
                style={{
                  inset: "8px",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              />
            </div>

            {/* Ánh sáng vàng từ bên trong khi mở nắp */}
            <AnimatePresence>
              {isGlowing && (
                <motion.div
                  key="inner-glow"
                  className="absolute rounded-2xl pointer-events-none overflow-hidden"
                  style={{ inset: 0, translateZ: "3px" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85 }}
                >
                  {/* Lớp sáng chính — vàng đậm ở giữa */}
                  <div
                    className="absolute"
                    style={{
                      bottom: 0,
                      left: "10%",
                      right: "10%",
                      height: "85%",
                      background:
                        "radial-gradient(ellipse at 50% 80%, rgba(255,220,80,1) 0%, rgba(255,180,30,0.85) 25%, rgba(220,140,10,0.5) 55%, transparent 80%)",
                      filter: "blur(6px)",
                    }}
                  />
                  {/* Lớp sáng phụ — trắng ở tâm */}
                  <div
                    className="absolute"
                    style={{
                      bottom: "5%",
                      left: "25%",
                      right: "25%",
                      height: "40%",
                      background:
                        "radial-gradient(ellipse, rgba(255,245,200,0.9) 0%, rgba(255,220,80,0.5) 50%, transparent 75%)",
                      filter: "blur(12px)",
                    }}
                  />
                  {/* Tia sáng nhỏ bắn ra */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 60%, rgba(255,240,150,0.35) 0%, transparent 60%)",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nắp phong bì — xanh đen, xoay mở */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                translateZ: "15px",
              }}
              animate={isFlapped ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 1.05, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className="w-full h-full relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, #162840 0%, #0A1520 80%)",
                }}
              >
                {/* Viền vàng nắp */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 500 172"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="1"
                    y1="1"
                    x2="250"
                    y2="171"
                    stroke="rgba(212,175,55,0.45)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="499"
                    y1="1"
                    x2="250"
                    y2="171"
                    stroke="rgba(212,175,55,0.45)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="1"
                    y1="1"
                    x2="499"
                    y2="1"
                    stroke="rgba(212,175,55,0.3)"
                    strokeWidth="1.5"
                  />
                </svg>
                {/* Ánh gradient vàng nhẹ */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(212,175,55,0.06) 0%, transparent 70%)",
                  }}
                />
              </div>
            </motion.div>

            {/* Con dấu sáp — MÀU VÀNG */}
            <motion.div
              className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              style={{ translateZ: "22px" }}
              animate={
                isFlapped
                  ? { scale: 0, opacity: 0, y: 20, transition: { duration: 0.3 } }
                  : { scale: 1, opacity: 1, y: 0 }
              }
            >
              {/* Vòng ngoài con dấu — vàng */}
              <div
                className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 38% 35%, #F5D060 0%, #D4AF37 45%, #A07825 75%, #7A5A10 100%)",
                  boxShadow:
                    "0 6px 28px rgba(212,175,55,0.55), 0 2px 8px rgba(0,0,0,0.5), inset 0 2px 6px rgba(255,255,255,0.28), inset 0 -2px 4px rgba(0,0,0,0.35)",
                  border: "1.5px solid rgba(212,175,55,0.7)",
                }}
              >
                {/* Vòng khắc chạm */}
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: "6px",
                    border: "1.5px solid rgba(120,80,10,0.5)",
                  }}
                />
                {/* Icon mũ tốt nghiệp */}
                <svg
                  className="w-8 h-8 fill-current"
                  style={{ color: "#3B2800" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  <path d="M5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
                </svg>
                {/* Ánh bóng vàng */}
                <div
                  className="absolute top-2 left-3 rounded-full"
                  style={{
                    width: "22px",
                    height: "10px",
                    background: "rgba(255,255,255,0.25)",
                    transform: "rotate(-30deg)",
                    filter: "blur(2px)",
                  }}
                />
              </div>

              {/* Vòng ping gợi ý */}
              {phase === "idle" && (
                <>
                  <span className="absolute -inset-3 rounded-full border border-[#D4AF37]/40 animate-ping opacity-55 pointer-events-none" />
                  <span
                    className="absolute -inset-6 rounded-full border border-[#D4AF37]/15 animate-ping opacity-30 pointer-events-none"
                    style={{ animationDelay: "0.5s" }}
                  />
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Chữ gợi ý */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.p
                key="hint"
                className="absolute bottom-16 text-[11px] tracking-[0.25em] uppercase select-none"
                style={{ color: "rgba(212,175,55,0.55)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ delay: 1.1, duration: 1.2 }}
              >
                Chạm vào con dấu để mở
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
