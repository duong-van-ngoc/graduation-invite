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
    // Bước 1: Mở nắp (0ms -> 1200ms)
    setPhase("opening");
 
    // Bước 2: Khi nắp vừa mở xong (sau 1200ms), bắt đầu fade out phong bì và hiện thiệp mời luôn
    setTimeout(() => {
      setPhase("fading");
      onStartFading?.();
    }, 1200);
 
    // Bước 3: Hoàn tất (sau 3200ms - giữ đốm sáng bay lơ lửng tiếp đè lên thiệp mời thêm 2 giây)
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">

          {/* Lớp nền tối - Fade out khi bắt đầu chuyển cảnh */}
          <motion.div
            className="absolute inset-0 bg-[#070C15] z-0 pointer-events-auto"
            initial={{ opacity: 1 }}
            animate={{ opacity: isFading ? 0 : 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Lớp hạt bụi đốm sáng bay lên - Nằm ở z-index cao đè lên thiệp mời ở dưới và fade out trễ hơn hẳn */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === "fading" ? [1, 1, 0] : 1 }}
            transition={{
              duration: 2.0,
              times: [0, 0.6, 1], // Giữ sáng 60% thời gian (1.2s đầu), 40% còn lại (0.8s) mới fade out về 0
              ease: "easeInOut"
            }}
          >
            {Array.from({ length: 120 }).map((_, i) => {
              const startX = Math.random() * 40 + 30; // Tập trung xung quanh khu vực phong bì (30% - 70%)
              const delay = Math.random() * 3;
              const duration = 2.5 + Math.random() * 3;
              const size = Math.random() * 3 + 1;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    left: `${startX}%`,
                    bottom: "20%",
                    background: "radial-gradient(circle, #FFEAA7 0%, #D4AF37 70%, transparent 100%)",
                    boxShadow: "0 0 8px #FFD700, 0 0 15px #FF8C00",
                  }}
                  animate={
                    phase !== "idle"
                      ? {
                        x: [0, (Math.random() - 0.5) * 160],
                        y: [0, -180 - Math.random() * 200],
                        opacity: [0, 1, 0.8, 0],
                        scale: [0.4, 1.3, 0.2],
                      }
                      : {
                        y: [0, -20, 0],
                        opacity: [0.1, 0.4, 0.1],
                      }
                  }
                  transition={{
                    duration: phase !== "idle" ? duration : 4 + Math.random() * 4,
                    repeat: Infinity,
                    delay: phase !== "idle" ? delay : Math.random() * 2,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </motion.div>

          {/* ── PHONG BÌ & CAMERA SHAKE ── */}
          <motion.div
            ref={containerRef}
            className="relative z-10 w-[340px] h-[230px] md:w-[500px] md:h-[340px] cursor-pointer select-none pointer-events-auto"
            style={
              phase === "idle"
                ? { rotateX, rotateY, transformStyle: "preserve-3d" }
                : { transformStyle: "preserve-3d" }
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={startOpening}
            initial={{ scale: 0.82, opacity: 0, y: 40 }}
            animate={
              isFading
                ? { opacity: 0, scale: 0.95 }
                : phase === "idle"
                  ? { scale: 1, opacity: 1, y: 0 }
                  : phase === "opening"
                    ? {
                      scale: [1, 1.05, 1.03],
                      x: [0, -1, 1, -1, 0],
                      y: [0, 1, -1, 0, 0],
                      transition: { duration: 1.1 }
                    }
                    : { scale: 1.08, opacity: 1 }
            }
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.3 }}
            whileHover={phase === "idle" ? { scale: 1.04 } : {}}
          >
            {/* LỚP BACK PHONG BÌ (MẶT SAU) */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #0a1320 0%, #112035 45%, #050a10 100%)",
                border: "1.8px solid rgba(212,175,55,0.45)",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,0.92), 0 0 40px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                transform: "translateZ(0px)",
              }}
            >
              {/* Texture giấy mờ mịn chất lượng cao */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />

              {/* Quét sáng chéo tương lai (Metallic Light Sweep) */}
              {phase === "idle" && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255, 220, 120, 0) 25%, rgba(255, 220, 120, 0.22) 50%, rgba(255, 220, 120, 0) 75%, transparent 100%)",
                    width: "40%",
                    height: "100%",
                    transform: "skewX(-25deg)",
                  }}
                  animate={{
                    left: ["-50%", "150%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.15, // trễ hơn front một chút tạo hiệu ứng 3D khúc xạ thủy tinh
                  }}
                />
              )}
            </div>



            {/* LỚP FRONT PHONG BÌ (MẶT TRƯỚC VỚI KHE CHỮ V) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(145deg, #0F1F35 0%, #15273F 50%, #070d14 100%)",
                clipPath: "polygon(0 35%, 50% 56%, 100% 35%, 100% 100%, 0 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                filter: "drop-shadow(0 -5px 15px rgba(0,0,0,0.5))",
                transform: "translateZ(10px)",
              }}
            >
              {/* Texture giấy mờ mịn cho Front */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />

              {/* Hiệu ứng quét sáng tương lai chạy từ trái qua phải */}
              {phase === "idle" && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255, 220, 120, 0) 25%, rgba(255, 220, 120, 0.22) 50%, rgba(255, 220, 120, 0) 75%, transparent 100%)",
                    width: "40%",
                    height: "100%",
                    transform: "skewX(-25deg)",
                  }}
                  animate={{
                    left: ["-50%", "150%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
              {/* Viền vàng góc nghiêng mặt trước */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 500 340"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="119"
                  x2="250"
                  y2="190.4"
                  stroke="rgba(212,175,55,0.4)"
                  strokeWidth="1.5"
                />
                <line
                  x1="500"
                  y1="119"
                  x2="250"
                  y2="190.4"
                  stroke="rgba(212,175,55,0.4)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Nắp phong bì — xanh đen, xoay mở */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                translateZ: "12px",
              }}
              animate={isFlapped ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 1.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className="w-full h-full relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, #162840 0%, #0A1520 80%)",
                  boxShadow: "inset 0 -2px 10px rgba(0,0,0,0.6)",
                }}
              >
                {/* Viền vàng nắp và bóng phản chiếu kim loại */}
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
                    stroke="rgba(212,175,55,0.6)"
                    strokeWidth="1.8"
                  />
                  <line
                    x1="499"
                    y1="1"
                    x2="250"
                    y2="171"
                    stroke="rgba(212,175,55,0.6)"
                    strokeWidth="1.8"
                  />
                  <line
                    x1="1"
                    y1="1"
                    x2="499"
                    y2="1"
                    stroke="rgba(212,175,55,0.4)"
                    strokeWidth="1.8"
                  />
                </svg>
                {/* Ánh phản quang nắp */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, transparent 60%)",
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              className="absolute top-[56%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              style={{ translateZ: "22px" }}
              animate={{
                scale: 1,
                filter: "drop-shadow(0 5px 12px rgba(0,0,0,0.55))",
              }}
              transition={{ duration: 0.8 }}
            >
              {/* Vòng ngoài con dấu — vàng dập nổi 3D */}
              <div
                className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #FFF099 0%, #D4AF37 40%, #AA8015 75%, #6A4E0A 100%)",
                  boxShadow:
                    "0 8px 32px rgba(212,175,55,0.65), 0 3px 12px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(0,0,0,0.55)",
                  border: "1.8px solid rgba(255,225,120,0.85)",
                }}
              >
                {/* Vòng khắc chạm sâu */}
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: "6px",
                    border: "1.5px solid rgba(90,60,10,0.7)",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
                  }}
                />
                {/* Icon mũ tốt nghiệp */}
                <svg
                  className="w-8 h-8 fill-current drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.65)]"
                  style={{ color: "#3B2800" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  <path d="M5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
                </svg>
                {/* Ánh sáng bóng vàng xéo */}
                <div
                  className="absolute top-2 left-3 rounded-full"
                  style={{
                    width: "22px",
                    height: "10px",
                    background: "rgba(255,255,255,0.35)",
                    transform: "rotate(-30deg)",
                    filter: "blur(1.5px)",
                  }}
                />
              </div>

              {/* Vòng ping gợi ý */}
              {phase === "idle" && (
                <>
                  <span className="absolute -inset-3 rounded-full border border-[#D4AF37]/50 animate-ping opacity-60 pointer-events-none" />
                  <span
                    className="absolute -inset-6 rounded-full border border-[#D4AF37]/25 animate-ping opacity-35 pointer-events-none"
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
                style={{ color: "rgba(212,175,55,0.75)", textShadow: "0 0 8px rgba(212,175,55,0.3)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ delay: 1.1, duration: 1.2 }}
              >
                Chạm vào con dấu để mở
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
