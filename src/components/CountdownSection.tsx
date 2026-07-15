"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { EVENT } from "@/lib/constants";
import { Award } from "lucide-react";

export default function CountdownSection() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT.date);

  const timeBlocks = [
    { label: "Ngày", value: days },
    { label: "Giờ", value: hours },
    { label: "Phút", value: minutes },
    { label: "Giây", value: seconds },
  ];

  // Các giá trị tối đa tương ứng để tính vòng tròn tiến trình
  const maxValues = { Ngày: 30, Giờ: 24, Phút: 60, Giây: 60 };
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="relative py-24 px-6" id="countdown">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary-light/10 to-primary pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ── 1. TIÊU ĐỀ SANG TRỌNG CỔ ĐIỂN ── */}
        <motion.div
          className="text-center mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-accent animate-pulse-slow" />
            <span className="text-accent/80 text-xs md:text-sm uppercase tracking-[0.25em] font-body font-light">
              Kính báo sự kiện
            </span>
          </div>
          
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gradient tracking-wide mb-2">
            KHOẢNH KHẮC VINH QUANG
          </h2>
          <p className="font-script text-4xl text-accent/90 select-none">
            Đếm ngược thời gian
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-4" />
        </motion.div>

        {/* ── 2. LƯỚI ĐỒNG HỒ ĐẾM NGƯỢC ── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          }}
        >
          {timeBlocks.map((block, index) => {
            // Tính toán % tiến độ cho vòng tròn
            const maxVal = block.label === "Ngày" ? Math.max(block.value, 30) : (maxValues[block.label as keyof typeof maxValues] || 60);
            const percentage = maxVal > 0 ? block.value / maxVal : 0;
            const strokeDashoffset = circumference - percentage * circumference;

            return (
              <motion.div
                key={block.label}
                className="relative rounded-2xl p-6 text-center border border-accent/20 overflow-hidden hover:border-accent/40 transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, #091220 0%, #111E33 100%)",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                {/* Vân chấm kỹ thuật số nhẹ ở nền thẻ */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                  backgroundImage: "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
                  backgroundSize: "12px 12px"
                }} />

                {/* Họa tiết góc vuông HUD mạ vàng */}
                <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-accent/40 pointer-events-none" />
                <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-accent/40 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-accent/40 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-accent/40 pointer-events-none" />

                {/* Vòng tròn Hologram chỉ báo tiến trình */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto flex items-center justify-center mb-4">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Vòng rãnh nền */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="rgba(250, 204, 21, 0.05)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="4, 3"
                    />
                    {/* Vòng tiến độ phát sáng */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#FACC15"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                    />
                  </svg>

                  {/* Số lật nằm chính giữa vòng tròn */}
                  <div className="relative h-16 flex items-center justify-center overflow-hidden z-10 select-none">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={block.value}
                        className="font-heading text-4xl md:text-5xl font-bold text-gradient"
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
                </div>

                {/* Nhãn hiển thị */}
                <p className="text-accent/80 text-xs md:text-sm uppercase tracking-[0.2em] font-semibold">
                  {block.label}
                </p>

                {/* Vạch ngăn cách nhỏ công nghệ */}
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto mt-3" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
