"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { STUDENT, EVENT } from "@/lib/constants";
import { Clock, MapPin, GraduationCap, Shirt, Heart } from "lucide-react";

export default function InvitationCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [guestName, setGuestName] = useState("Bạn");

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

  // Định dạng ngày dạng DD.MM.YYYY
  const dateFormatted = EVENT.date
    .toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".");

  return (
    <section className="relative py-32 px-6" id="invitation">
      {/* Hào quang nền */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Vòng tròn công nghệ đồng tâm xoay chậm nền thiệp */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[600px] md:h-[600px] pointer-events-none opacity-10 select-none z-0">
        <svg className="w-full h-full animate-[spin_240s_linear_infinite]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" stroke="rgba(250, 204, 21, 0.1)" strokeWidth="0.3" fill="none" strokeDasharray="4, 8" />
          <circle cx="100" cy="100" r="70" stroke="rgba(250, 204, 21, 0.08)" strokeWidth="0.4" fill="none" strokeDasharray="30, 10" />
        </svg>
      </div>

      {/* 3D Card Container */}
      <motion.div
        className="max-w-xl mx-auto perspective-[1000px]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          ref={cardRef}
          className="relative rounded-3xl overflow-hidden cursor-default shadow-[0_30px_70px_rgba(0,0,0,0.85)]"
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
          {/* Lớp nền phong cách giấy nhám Navy sang trọng mạ vàng */}
          <div
            className="relative rounded-3xl p-8 md:p-12 border border-accent/30 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #0B1425 0%, #15233C 60%, #060D1A 100%)",
            }}
          >
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
            <div className="flex flex-col items-center mb-6">
              <GraduationCap className="w-9 h-9 text-accent mb-2 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
              <p className="text-accent/80 text-xs md:text-sm uppercase tracking-[0.25em] font-body font-light">
                Trân trọng kính mời
              </p>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-2" />
            </div>

            {/* ── 2. TIÊU ĐỀ CHÍNH (MAIN TITLE) ── */}
            <div className="text-center mb-8">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gradient tracking-widest mb-1">
                THIỆP MỜI
              </h2>
              <p className="font-script text-5xl md:text-6xl text-accent my-3 select-none leading-none">
                Tốt Nghiệp
              </p>
              <p className="text-accent/60 text-xs tracking-[0.3em] uppercase mt-2">
                — We Are Graduate —
              </p>
            </div>

            {/* ── 3. LỜI MỜI CHI TIẾT (INVITATION MESSAGE) ── */}
            <div className="text-center mb-8 px-2">
              <p className="text-muted text-sm md:text-base leading-relaxed max-w-sm mx-auto">
                {guestName === "Bạn" ? (
                  <>
                    Trân trọng kính mời Bạn bè và Gia đình <br />
                    đến tham dự buổi lễ tốt nghiệp của
                  </>
                ) : (
                  <>
                    Trân trọng kính mời <span className="text-surface font-semibold">{guestName}</span> <br />
                    đến tham dự buổi lễ tốt nghiệp của
                  </>
                )}
              </p>
            </div>

            {/* ── 4. THÔNG TIN CỬ NHÂN (GRADUATE INFO) ── */}
            <div className="text-center mb-10">
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto mb-4" />
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-gradient tracking-wide mb-3">
                {STUDENT.name.toUpperCase()}
              </h3>
              <div className="flex justify-center my-3">
                <GraduationCap className="w-5 h-5 text-accent/70" />
              </div>
              <p className="text-accent text-sm md:text-base font-semibold tracking-wider mb-1">
                CỬ NHÂN {STUDENT.major.toUpperCase()}
              </p>
              <p className="text-muted text-xs md:text-sm tracking-widest uppercase">
                KHÓA 2021 — 2025
              </p>
            </div>

            {/* ── 5. CHI TIẾT SỰ KIỆN 3 CỘT (EVENT DETAILS - Responsive) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-accent/15 border-t border-b border-accent/15 py-8 mb-10">
              {/* Cột 1: THỜI GIAN */}
              <div className="flex flex-col items-center text-center px-4 py-4 md:py-0">
                <div className="w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center mb-3 bg-accent/5">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <h4 className="text-accent text-xs md:text-sm font-bold tracking-widest uppercase mb-2 font-body">
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
                <div className="w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center mb-3 bg-accent/5">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <h4 className="text-accent text-xs md:text-sm font-bold tracking-widest uppercase mb-2 font-body">
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

              {/* Cột 3: TRANG PHỤC */}
              <div className="flex flex-col items-center text-center px-4 py-4 md:py-0">
                <div className="w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center mb-3 bg-accent/5">
                  <Shirt className="w-5 h-5 text-accent" />
                </div>
                <h4 className="text-accent text-xs md:text-sm font-bold tracking-widest uppercase mb-2 font-body">
                  Trang Phục
                </h4>
                <p className="text-surface font-semibold text-sm md:text-base">
                  {EVENT.dressCode}
                </p>
                <p className="text-muted text-xs md:text-sm mt-1">
                  Lễ phục tốt nghiệp
                </p>
              </div>
            </div>

            {/* ── 6. LỜI CẢM ƠN & CHỮ KÝ (FOOTER MESSAGE) ── */}
            <div className="text-center mt-6">
              <p className="text-muted text-sm italic leading-relaxed max-w-sm mx-auto mb-4 px-4">
                &ldquo;Sự hiện diện của Quý vị là niềm vinh hạnh <br />
                và động viên lớn lao đối với tôi!&rdquo;
              </p>
              <p className="font-script text-4xl text-accent my-2 select-none">
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
