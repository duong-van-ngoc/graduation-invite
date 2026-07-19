"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { sfx } from "@/lib/audio";

// Phase flow:
// idle             → phong bì xanh đen nổi, hover nghiêng 3D
// seal_glowing     → con dấu phát sáng (0.4s)
// seal_dissolving  → con dấu tan rã thành các hạt bụi vàng (0.5s)
// opening          → nắp phong bì mở ra (0.8s)
// fading           → phong bì mờ dần, trang chính hiện ra phía sau (0.8s)
// done             → gọi onComplete()
type Phase =
  | "idle"
  | "seal_glowing"
  | "seal_dissolving"
  | "opening"
  | "fading"
  | "done";

interface EnvelopeAnimationProps {
  onComplete: (guestName: string) => void;
  onStartFading?: (guestName: string) => void; // báo parent bắt đầu hiện nội dung
}

const luxuryPaperPattern = {
  backgroundImage: `
    linear-gradient(135deg, rgba(212,175,55,0.035) 25%, transparent 25%), 
    linear-gradient(225deg, rgba(212,175,55,0.035) 25%, transparent 25%), 
    linear-gradient(45deg, rgba(212,175,55,0.035) 25%, transparent 25%), 
    linear-gradient(315deg, rgba(212,175,55,0.035) 25%, transparent 25%)
  `,
  backgroundSize: "32px 32px",
  backgroundPosition: "0 0, 0 16px, 16px -16px, -16px 0px"
};

export default function EnvelopeAnimation({
  onComplete,
  onStartFading,
}: EnvelopeAnimationProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [inputName, setInputName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sinh các thuộc tính ngẫu nhiên cố định cho hạt bụi để tránh render lại liên tục (tối ưu hóa hiệu năng)
  const staticParticles = useMemo(() => {
    const count = isMobile ? 150 : 300;
    return Array.from({ length: count }).map((_, i) => {
      const startX = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const delay = Math.random() * 8;
      const drift = (Math.random() - 0.5) * 40;
      const yVariation = Math.random() * 8 - 4;
      const fallDuration = 3 + Math.random() * 2.5;
      const normalDuration = 6 + Math.random() * 4;
      return {
        id: i,
        startX,
        size,
        delay,
        drift,
        yVariation,
        fallDuration,
        normalDuration,
      };
    });
  }, [isMobile]);

  // Sinh các hạt bụi vàng từ con dấu khi nó tan rã (seal_dissolving)
  const sealParticles = useMemo(() => {
    const count = isMobile ? 50 : 90;
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const velocity = 60 + Math.random() * 140;
      const size = Math.random() * 3 + 2;
      const delay = Math.random() * 0.25;
      return {
        id: i,
        angle,
        velocity,
        size,
        delay,
      };
    });
  }, [isMobile]);

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
    const submittedName = inputName.trim();

    if (!submittedName) {
      setNameError("Vui lòng nhập tên của bạn để mở thiệp");
      inputRef.current?.focus();
      return;
    }

    setNameError("");

    // Phát âm thanh mở phong bì & kích hoạt nhạc nền
    sfx.playOpenEnvelope();
    sfx.playBGM();

    // 1. Click con dấu -> Con dấu phát sáng (0ms -> 400ms)
    setPhase("seal_glowing");

    // 2. Con dấu tan thành hạt vàng (400ms -> 900ms)
    setTimeout(() => {
      setPhase("seal_dissolving");
    }, 400);

    // 3. Nắp phong bì mở ra (900ms -> 1700ms)
    setTimeout(() => {
      setPhase("opening");
    }, 900);

    // 4. Fade out phong bì và hiện Hero Section (1700ms -> 2500ms)
    setTimeout(() => {
      setPhase("fading");
      onStartFading?.(submittedName);
    }, 1700);

    // 5. Hoàn tất (sau 2500ms)
    setTimeout(() => {
      setPhase("done");
      onComplete(submittedName);
    }, 6500);
  };

  const isFlapped =
    phase !== "idle" &&
    phase !== "seal_glowing" &&
    phase !== "seal_dissolving";
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
          {/* Lớp hạt bụi vàng */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none z-20"
            initial={{ opacity: 1 }}
            animate={{
              opacity: phase === "fading" ? 0 : 1,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
          >
            {(() => {
              const isMd = dimensions.width >= 768;
              const envelopeWidth = isMd ? 500 : 340;
              const envelopeHeight = isMd ? 340 : 230;
              const envelopeLeft = (dimensions.width - envelopeWidth) / 2;
              const envelopeRight = (dimensions.width + envelopeWidth) / 2;
              const envelopeTop = (dimensions.height - envelopeHeight) / 2;

              return staticParticles.map((particle) => {
                const startX = particle.startX;
                const size = particle.size;
                const xPos = (startX / 100) * dimensions.width;
                // Chỉ cho khoảng 35% số hạt bụi nằm trên vùng thư đọng lại (id chia hết cho 3)
                // Số hạt còn lại vẫn rơi xuyên qua xuống dưới để tránh tạo khoảng trống (hole) ở giữa màn hình.
                const isAboveEnvelope =
                  xPos >= envelopeLeft &&
                  xPos <= envelopeRight &&
                  particle.id % 3 === 0;

                let yKeyframes: number[];
                let opacityKeyframes: number[];
                let scaleKeyframes: number[];
                let timesKeyframes: number[];
                let duration: number;
                let delay = particle.delay;

                const drift = particle.drift;
                let xKeyframes: number[];

                if (isAboveEnvelope) {
                  // Đọng lại ở viền trên của thư
                  // Dịch chuyển y từ -30px (trên cùng) xuống envelopeTop (viền trên)
                  const yTarget = envelopeTop + particle.yVariation; // Dao động nhẹ quanh viền
                  const fallDuration = particle.fallDuration; // Thời gian rơi
                  const stayDuration = 2.0; // Đọng lại trong 2s
                  const fadeDuration = 0.5; // Biến mất dần trong 0.5s
                  duration = fallDuration + stayDuration + fadeDuration;

                  const t1 = fallDuration / duration;
                  const t2 = (fallDuration + stayDuration) / duration;

                  yKeyframes = [-30, yTarget, yTarget, yTarget];
                  xKeyframes = [0, drift, drift, drift];
                  opacityKeyframes = [0, 1, 1, 0];
                  scaleKeyframes = [0.6, 1.0, 1.0, 0.4];
                  timesKeyframes = [0, t1, t2, 1];
                } else {
                  // Rơi thẳng xuống dưới màn hình
                  const yTarget = dimensions.height + 40;
                  duration = particle.normalDuration;

                  yKeyframes = [-30, yTarget];
                  xKeyframes = [0, drift, drift * 1.5];
                  opacityKeyframes = [0, 1, 1, 0];
                  scaleKeyframes = [0.6, 1.0, 1.0, 0.4];
                  timesKeyframes = [0, 0.1, 0.9, 1];
                }

                return (
                  <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      left: `${startX}%`,
                      top: 0,
                      background:
                        "radial-gradient(circle, rgba(255,248,220,1) 0%, rgba(255,220,120,0.85) 50%, transparent 100%)",
                      boxShadow: "0 0 4px rgba(255,220,120,0.8), 0 0 10px rgba(255,220,120,0.35)",
                    }}
                    animate={{
                      y: yKeyframes,
                      x: xKeyframes,
                      opacity: opacityKeyframes,
                      scale: scaleKeyframes,
                    }}
                    transition={{
                      duration: duration,
                      repeat: Infinity,
                      delay: delay,
                      ease: isAboveEnvelope ? "easeOut" : "linear",
                      times: timesKeyframes,
                    }}
                  />
                );
              });
            })()}
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
                  : phase === "seal_glowing"
                    ? { scale: 1.02 }
                    : phase === "seal_dissolving"
                      ? { scale: 1.03 }
                      : phase === "opening"
                        ? { scale: 1.05 }
                        : { scale: 1.08, opacity: 1 }
            }
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 14,
              delay: phase === "idle" ? 0.3 : 0,
            }}
            whileHover={phase === "idle" ? { scale: 1.04 } : {}}
          >
            {/* Ánh sáng nền động (Ambient Glow) tỏa ra phía sau khi hover phong bì */}
            {phase === "idle" && (
              <motion.div
                className="absolute -inset-14 rounded-[32px] pointer-events-none z-0"
                style={{
                  background: "radial-gradient(circle, rgba(255, 215, 0, 0.22) 0%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)",
                  filter: "blur(24px)",
                  transform: "translateZ(-15px)", // Nằm lùi về phía sau trong không gian 3D
                }}
                initial={{ opacity: 0.4, scale: 0.95 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
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
              {/* Texture giấy mờ mịn chất lượng cao (Diamond Grid) */}
              <div
                className="absolute inset-0 opacity-[0.6]"
                style={luxuryPaperPattern}
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
              {/* Texture giấy mờ mịn cho Front (Diamond Grid) */}
              <div
                className="absolute inset-0 opacity-[0.6]"
                style={luxuryPaperPattern}
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
              {/* Viền vàng và các đường nét Art Deco mặt trước */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 500 340"
                preserveAspectRatio="none"
              >
                {/* Viền ngoài dưới của Front */}
                <path
                  d="M 1.5 119 L 1.5 338.5 L 498.5 338.5 L 498.5 119"
                  stroke="url(#gold-grad)"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* Viền chéo khe chữ V chính */}
                <line
                  x1="0"
                  y1="119"
                  x2="250"
                  y2="190.4"
                  stroke="url(#gold-grad)"
                  strokeWidth="1.5"
                />
                <line
                  x1="500"
                  y1="119"
                  x2="250"
                  y2="190.4"
                  stroke="url(#gold-grad)"
                  strokeWidth="1.5"
                />

                {/* Đường đứt nét song song tạo viền đôi cho khe chữ V */}
                <line
                  x1="0"
                  y1="126"
                  x2="250"
                  y2="197.4"
                  stroke="url(#gold-grad)"
                  strokeWidth="0.8"
                  strokeOpacity="0.5"
                  strokeDasharray="4 2"
                />
                <line
                  x1="500"
                  y1="126"
                  x2="250"
                  y2="197.4"
                  stroke="url(#gold-grad)"
                  strokeWidth="0.8"
                  strokeOpacity="0.5"
                  strokeDasharray="4 2"
                />
              </svg>

              {/* Họa tiết góc Art Deco - Góc dưới bên trái */}
              <svg
                className="absolute bottom-3 left-3 w-10 h-10 pointer-events-none opacity-80"
                viewBox="0 0 48 48"
                fill="none"
              >
                <path
                  d="M 2 0 L 2 46 L 48 46"
                  stroke="url(#gold-grad)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 6 0 L 6 42 L 48 42"
                  stroke="url(#gold-grad)"
                  strokeWidth="0.8"
                  strokeOpacity="0.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 2 34 L 14 46 M 6 34 L 18 46 M 2 26 L 22 46"
                  stroke="url(#gold-grad)"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
                <circle cx="10" cy="38" r="1.5" fill="#D4AF37" />
              </svg>

              {/* Họa tiết góc Art Deco - Góc dưới bên phải */}
              <svg
                className="absolute bottom-3 right-3 w-10 h-10 pointer-events-none opacity-80"
                viewBox="0 0 48 48"
                fill="none"
              >
                <path
                  d="M 46 0 L 46 46 L 0 46"
                  stroke="url(#gold-grad)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 42 0 L 42 42 L 0 42"
                  stroke="url(#gold-grad)"
                  strokeWidth="0.8"
                  strokeOpacity="0.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 46 34 L 34 46 M 42 34 L 30 46 M 46 26 L 26 46"
                  stroke="url(#gold-grad)"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
                <circle cx="38" cy="38" r="1.5" fill="#D4AF37" />
              </svg>
            </div>

            {/* Ánh sáng vàng rò rỉ phát ra từ bên trong khi nắp mở */}
            {phase === "opening" && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 40%, rgba(255, 215, 0, 0.5) 0%, rgba(255, 140, 0, 0.2) 60%, transparent 80%)",
                  filter: "blur(12px)",
                  transform: "translateZ(5px)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Nắp phong bì — xanh đen, xoay mở */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                translateZ: "12px",
              }}
              animate={isFlapped ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div
                className="w-full h-full relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, #162840 0%, #0A1520 80%)",
                  boxShadow: "inset 0 -2px 10px rgba(0,0,0,0.6)",
                }}
              >
                {/* Texture giấy mờ mịn cho Nắp (Diamond Grid) */}
                <div
                  className="absolute inset-0 opacity-[0.5]"
                  style={luxuryPaperPattern}
                />

                {/* Tiêu đề chữ nhũ vàng ép kim */}
                <div className="absolute top-[22%] left-1/2 -translate-x-1/2 text-center pointer-events-none w-[80%] z-10">
                  <span className="text-[10px] md:text-[13px] font-serif uppercase tracking-[0.25em] font-semibold bg-gradient-to-r from-[#FFF099] via-[#D4AF37] to-[#AA8015] bg-clip-text text-transparent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)]">
                    Graduation Invitation
                  </span>
                </div>

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
                    stroke="url(#gold-grad)"
                    strokeWidth="1.8"
                  />
                  <line
                    x1="499"
                    y1="1"
                    x2="250"
                    y2="171"
                    stroke="url(#gold-grad)"
                    strokeWidth="1.8"
                  />
                  <line
                    x1="1"
                    y1="1"
                    x2="499"
                    y2="1"
                    stroke="url(#gold-grad)"
                    strokeWidth="1.8"
                  />

                  {/* Viền đứt nét song song tinh tế cho nắp */}
                  <line
                    x1="12"
                    y1="4"
                    x2="250"
                    y2="165"
                    stroke="url(#gold-grad)"
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1="488"
                    y1="4"
                    x2="250"
                    y2="165"
                    stroke="url(#gold-grad)"
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                    strokeDasharray="4 2"
                  />

                  {/* Họa tiết Art Deco nắp trái */}
                  <path
                    d="M 12 6 L 62 6 M 12 11 L 52 11 M 12 16 L 42 16"
                    stroke="url(#gold-grad)"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M 17 6 L 17 26 L 37 6"
                    stroke="url(#gold-grad)"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                  />

                  {/* Họa tiết Art Deco nắp phải */}
                  <path
                    d="M 488 6 L 438 6 M 488 11 L 448 11 M 488 16 L 458 16"
                    stroke="url(#gold-grad)"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M 483 6 L 483 26 L 463 6"
                    stroke="url(#gold-grad)"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
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

            {/* Hạt bụi từ con dấu khi tan rã */}
            {phase === "seal_dissolving" && (
              <div className="absolute top-[56%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30" style={{ transformStyle: "preserve-3d", transform: "translateZ(25px)" }}>
                {sealParticles.map((p) => {
                  const xTarget = Math.cos(p.angle) * p.velocity;
                  // Bay hướng bổng lên trên
                  const yTarget = Math.sin(p.angle) * p.velocity - 120;
                  return (
                    <motion.div
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        width: p.size,
                        height: p.size,
                        left: 0,
                        top: 0,
                        background: "radial-gradient(circle, #FFFFFF 0%, #FFEAA7 50%, #D4AF37 100%)",
                        boxShadow: "0 0 8px #FFD700, 0 0 15px #FF8C00",
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: [0, xTarget * 0.5, xTarget],
                        y: [0, yTarget * 0.4, yTarget],
                        opacity: [1, 0.9, 0],
                        scale: [1, 1.2, 0.2],
                      }}
                      transition={{
                        duration: 1.0 + Math.random() * 0.5,
                        delay: p.delay,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </div>
            )}

            <motion.div
              className="absolute top-[56%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              style={{ translateZ: "22px" }}
              animate={
                phase === "seal_glowing"
                  ? {
                    scale: [1, 1.25, 1.2],
                    boxShadow: "0 0 35px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 140, 0, 0.7)",
                    filter: "brightness(1.3) drop-shadow(0 5px 12px rgba(0,0,0,0.55))",
                  }
                  : phase === "seal_dissolving"
                    ? {
                      scale: 0,
                      opacity: 0,
                      filter: "brightness(1.8) blur(2px) drop-shadow(0 5px 12px rgba(0,0,0,0.55))",
                    }
                    : phase === "idle"
                      ? {
                        scale: 1,
                        opacity: 1,
                        filter: "drop-shadow(0 5px 12px rgba(0,0,0,0.55))",
                      }
                      : {
                        scale: 0,
                        opacity: 0,
                      }
              }
              transition={{
                duration: phase === "seal_dissolving" ? 0.6 : 0.8,
                ease: "easeInOut",
              }}
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

          {/* Ô nhập tên khách mời */}
          {phase === "idle" && (
            <motion.div
              className="mt-6 md:mt-8 flex flex-col items-center gap-3 pointer-events-auto z-20"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Nhập tên của bạn..."
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") startOpening();
                  }}
                  required
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "guest-name-error" : undefined}
                  className={`w-[260px] md:w-[300px] px-4 py-2.5 rounded-xl border bg-[#0a1320]/80 text-[#FFF099] placeholder-[#D4AF37]/50 text-center text-sm md:text-base focus:outline-none focus:ring-1 transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),_0_4px_12px_rgba(0,0,0,0.5)] font-serif ${
                    nameError
                      ? "border-red-400/80 focus:border-red-300 focus:ring-red-400/50"
                      : "border-[#D4AF37]/35 focus:border-[#D4AF37] focus:ring-[#D4AF37]/50"
                  }`}
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent shadow-[0_0_10px_rgba(212,175,55,0.1)]" />
              </div>
              {nameError && (
                <motion.p
                  id="guest-name-error"
                  className="max-w-[260px] md:max-w-[300px] text-center text-[11px] md:text-xs tracking-wide text-red-300 font-serif"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {nameError}
                </motion.p>
              )}
              <p className="text-[11px] md:text-xs tracking-wider text-[#D4AF37]/75 font-serif italic">
                * Nhập tên của bạn và nhấn con dấu để mở thiệp
              </p>
            </motion.div>
          )}


          {/* Định nghĩa Gradient vàng nhũ dùng chung */}
          <svg style={{ width: 0, height: 0, position: 'absolute' }}>
            <defs>
              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF099" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#AA8015" />
              </linearGradient>
            </defs>
          </svg>

        </div>
      )}
    </AnimatePresence>
  );
}
