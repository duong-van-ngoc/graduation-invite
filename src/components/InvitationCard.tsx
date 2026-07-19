"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { STUDENT, EVENT } from "@/lib/constants";
import { Clock, MapPin, GraduationCap, Heart, Scroll } from "lucide-react";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

interface InvitationCardProps {
  guestName?: string;
}

function GuestNameReveal({ name }: { name: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span className="relative mx-auto mt-1 block w-fit max-w-full px-4 pb-2">
      <motion.span
        className="relative z-10 block max-w-full break-words bg-clip-text font-script text-3xl leading-tight text-transparent md:text-4xl"
        style={{
          backgroundImage:
            "linear-gradient(110deg, #D4AF37 0%, #FACC15 34%, #FFF7C2 50%, #FACC15 66%, #D4AF37 100%)",
          backgroundSize: "250% 100%",
          filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.2))",
        }}
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                clipPath: "inset(0 100% 0 0)",
                backgroundPosition: "200% 50%",
              }
        }
        whileInView={{
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          backgroundPosition: "-35% 50%",
        }}
        viewport={{ once: true, amount: 0.85 }}
        transition={{
          opacity: { duration: 0.35 },
          clipPath: {
            duration: 1.25,
            ease: [0.16, 1, 0.3, 1],
          },
          backgroundPosition: {
            duration: 1.1,
            delay: 0.85,
            ease: "easeInOut",
          },
        }}
      >
        {name}
      </motion.span>

      <motion.span
        className="absolute inset-x-2 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-accent/75 to-transparent shadow-[0_0_8px_rgba(250,204,21,0.35)]"
        initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.85 }}
        transition={{
          duration: 0.9,
          delay: 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
        aria-hidden="true"
      />
    </span>
  );
}

export default function InvitationCard({ guestName: propGuestName }: InvitationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { lowPower } = useDevicePerformance();
  const [queryGuestName] = useState(() => {
    if (typeof window === "undefined") return "";

    const params = new URLSearchParams(window.location.search);
    return params.get("to") || params.get("name") || "";
  });
  const guestName = propGuestName || queryGuestName || "Bạn";

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  // Tọa độ vệt sáng vàng tương tác đuổi theo chuột
  const glowX = useMotionValue(-1000);
  const glowY = useMotionValue(-1000);

  const glowXSpring = useSpring(glowX, { stiffness: 300, damping: 30 });
  const glowYSpring = useSpring(glowY, { stiffness: 300, damping: 30 });

  const glowBg = useTransform(
    [glowXSpring, glowYSpring],
    ([xVal, yVal]) => `radial-gradient(circle 220px at ${xVal}px ${yVal}px, rgba(250, 204, 21, 0.15), transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lowPower) return;

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Nghiêng 3D
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);

    // Vệt sáng vàng
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    // Di chuyển vệt sáng ra ngoài vùng hiển thị
    glowX.set(-1000);
    glowY.set(-1000);
  };

  // Định dạng ngày dạng DD.MM.YYYY
  const dateFormatted = EVENT.date
    .toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".");

  return (
    <section className="relative py-16 px-6" id="invitation">
      {/* Hào quang nền */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Vòng tròn công nghệ đồng tâm xoay chậm nền thiệp */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[600px] md:h-[600px] pointer-events-none opacity-10 select-none z-0">
        <svg className="w-full h-full animate-[spin_240s_linear_infinite]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" stroke="rgba(250, 204, 21, 0.1)" strokeWidth="0.3" fill="none" strokeDasharray="4, 8" />
          <circle cx="100" cy="100" r="70" stroke="rgba(250, 204, 21, 0.08)" strokeWidth="0.4" fill="none" strokeDasharray="30, 10" />
        </svg>
      </div>

      {/* Trang trí rìa bên trái - Ruy-băng vàng uốn lượn và hoa văn HUD */}
      <motion.div
        className="hidden lg:block absolute left-[5%] xl:left-[10%] top-1/2 -translate-y-1/2 w-32 h-80 pointer-events-none select-none z-10 text-accent"
        animate={{ y: ["-50%", "-54%", "-50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 250">
          <defs>
            <linearGradient id="gold-ribbon-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
              <stop offset="30%" stopColor="#FDE68A" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#FACC15" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path d="M15 25 C45 85, 75 55, 45 125 C15 195, 85 175, 55 235" fill="none" stroke="url(#gold-ribbon-left)" strokeWidth="3" strokeLinecap="round" />
          {/* Target Reticle */}
          <circle cx="45" cy="125" r="3" fill="#FACC15" opacity="0.5" />
          <line x1="33" y1="125" x2="57" y2="125" stroke="rgba(250,204,21,0.25)" strokeWidth="0.5" />
          <line x1="45" y1="113" x2="45" y2="137" stroke="rgba(250,204,21,0.25)" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[22%] left-[8%] xl:left-[12%] hidden lg:block z-10 text-accent/30 pointer-events-none select-none"
        animate={{
          y: [0, 15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <GraduationCap className="w-10 h-10 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.2)]" />
      </motion.div>

      {/* Cuộn thư góc dưới bên trái */}
      <motion.div
        className="absolute bottom-[22%] left-[8%] xl:left-[12%] hidden lg:block z-10 text-accent/30 pointer-events-none select-none"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Scroll className="w-10 h-10 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.2)]" />
      </motion.div>

      {/* Trang trí rìa bên phải - Ruy-băng vàng uốn lượn đối xứng gương và mũ tốt nghiệp */}
      <motion.div
        className="hidden lg:block absolute right-[5%] xl:right-[10%] top-1/2 -translate-y-1/2 w-32 h-80 pointer-events-none select-none z-10 text-accent scale-x-[-1]"
        animate={{ y: ["-50%", "-54%", "-50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 250">
          <defs>
            <linearGradient id="gold-ribbon-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
              <stop offset="30%" stopColor="#FDE68A" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#FACC15" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path d="M15 25 C45 85, 75 55, 45 125 C15 195, 85 175, 55 235" fill="none" stroke="url(#gold-ribbon-right)" strokeWidth="3" strokeLinecap="round" />
          {/* Target Reticle */}
          <circle cx="45" cy="125" r="3" fill="#FACC15" opacity="0.5" />
          <line x1="33" y1="125" x2="57" y2="125" stroke="rgba(250,204,21,0.25)" strokeWidth="0.5" />
          <line x1="45" y1="113" x2="45" y2="137" stroke="rgba(250,204,21,0.25)" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[22%] right-[8%] xl:right-[12%] hidden lg:block z-10 text-accent/30 pointer-events-none select-none scale-x-[-1]"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <GraduationCap className="w-10 h-10 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.2)]" />
      </motion.div>

      {/* Cuộn thư góc dưới bên phải */}
      <motion.div
        className="absolute bottom-[22%] right-[8%] xl:right-[12%] hidden lg:block z-10 text-accent/30 pointer-events-none select-none scale-x-[-1]"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 12, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Scroll className="w-10 h-10 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.2)]" />
      </motion.div>

      {/* 3D Card Container */}
      <motion.div
        className="max-w-md mx-auto perspective-[1000px]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          ref={cardRef}
          className="relative rounded-3xl overflow-hidden cursor-default shadow-[0_30px_70px_rgba(0,0,0,0.85)]"
          style={{
            rotateX: lowPower ? undefined : rotateX,
            rotateY: lowPower ? undefined : rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={lowPower ? undefined : { scale: 1.02 }}
          transition={{ scale: { duration: 0.3 } }}
        >
          {/* Lớp nền phong cách giấy nhám Navy sang trọng mạ vàng */}
          <div
            className="relative rounded-3xl p-6 md:p-8 border border-accent/30 overflow-hidden animate-gradient"
            style={{
              background:
                "linear-gradient(-45deg, #0B1425, #15233C, #060D1A, #101E35)",
              backgroundSize: "400% 400%",
            }}
          >
            {/* Lớp phủ vệt sáng vàng tương tác di chuyển theo chuột */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              style={{ background: glowBg }}
            />
            {/* Vân giấy mịn cao cấp */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #D4AF37 1.5px, transparent 1.5px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Khung viền đôi mạ vàng */}
            <div className="absolute inset-3 border border-accent/15 rounded-2xl pointer-events-none" />

            {/* Họa tiết góc cổ điển */}
            <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-accent/40 pointer-events-none" />
            <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-accent/40 pointer-events-none" />
            <div className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-accent/40 pointer-events-none" />
            <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-accent/40 pointer-events-none" />

            {/* ── 1. ĐẦU THIỆP (TOP DECORATION) ── */}
            <div className="flex flex-col items-center mb-4">
              <GraduationCap className="w-9 h-9 text-accent mb-2 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-2" />
            </div>

            {/* ── 2. TIÊU ĐỀ CHÍNH (MAIN TITLE) ── */}
            <div className="text-center mb-4">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gradient tracking-widest mb-1">
                THIỆP MỜI
              </h2>
              <p className="font-script text-5xl md:text-6xl text-accent my-1 select-none leading-none">
                Tốt Nghiệp
              </p>
            </div>

            {/* ── 3. LỜI MỜI CHI TIẾT (INVITATION MESSAGE) ── */}
            <div className="text-center mb-5 px-2">
              <p className="text-muted text-sm md:text-base leading-relaxed max-w-sm mx-auto">
                Trân trọng kính mời
              </p>
              <GuestNameReveal
                name={guestName}
              />
              <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-muted md:text-base">
                đến tham dự buổi lễ tốt nghiệp của
              </p>
            </div>

            {/* ── 4. THÔNG TIN CỬ NHÂN (GRADUATE INFO) ── */}
            <div className="text-center mb-6">
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto mb-4" />
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-gradient tracking-wide mb-2">
                {STUDENT.name.toUpperCase()}
              </h3>
            </div>

            {/* ── 5. CHI TIẾT SỰ KIỆN 2 CỘT (EVENT DETAILS - Responsive) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-accent/15 border-t border-b border-accent/15 py-5 mb-6">
              {/* Cột 1: THỜI GIAN */}
              <div className="flex flex-col items-center text-center px-4 py-4 md:py-0">
                <div className="w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center mb-2 bg-accent/5">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <h4 className="text-accent text-xs md:text-sm font-bold tracking-widest uppercase mb-1 font-body">
                  Thời Gian
                </h4>
                <p className="text-surface font-semibold text-sm md:text-base">
                  {EVENT.time.split(" ")[0]} | Chủ Nhật
                </p>
                <p className="text-muted text-xs md:text-sm mt-1">
                  {dateFormatted}
                </p>
              </div>

              {/* Cột 2: ĐỊA ĐIỂM */}
              <div className="flex flex-col items-center text-center px-4 py-4 md:py-0">
                <div className="w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center mb-2 bg-accent/5">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <h4 className="text-accent text-xs md:text-sm font-bold tracking-widest uppercase mb-1 font-body">
                  Địa Điểm
                </h4>
                <p className="text-surface font-semibold text-sm md:text-base">
                  {EVENT.venue.split("|")[0].trim()}
                </p>
                <p className="text-muted text-xs md:text-sm mt-1 leading-relaxed">
                  {EVENT.venue.split("|")[1]?.trim() || "Tòa nhà A9-A10"} <br />
                  {EVENT.venue.split("|")[2]?.trim() || "Đại học Phenikaa"}
                </p>
              </div>
            </div>

            {/* ── 6. LỜI CẢM ƠN & CHỮ KÝ (FOOTER MESSAGE) ── */}
            <div className="text-center mt-4">
              <p className="font-script text-4xl text-accent my-1 select-none">
                Trân trọng!
              </p>
              <div className="flex justify-center mt-2">
                <Heart className="w-5 h-5 text-accent fill-accent animate-pulse-slow" />
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
