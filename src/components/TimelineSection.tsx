"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TIMELINE } from "@/lib/constants";
import { useTimelineGlow } from "@/hooks/useScrollAnimation";
import { fadeInLeft, fadeInRight, scaleIn } from "@/lib/animation";

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useTimelineGlow<HTMLDivElement>();

  return (
    <section className="relative py-32 px-6 overflow-hidden" id="timeline">
      {/* Section Title */}
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-accent text-sm uppercase tracking-[0.3em] mb-4">
          Hành trình
        </p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-surface mb-4">
          4 Năm Đại Học
        </h2>
        <p className="text-muted max-w-lg mx-auto">
          Những cột mốc đáng nhớ trong hành trình chinh phục tri thức
        </p>
      </motion.div>

      {/* Timeline */}
      <div ref={containerRef} className="relative max-w-5xl mx-auto">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-surface/5 hidden md:block">
          <div
            ref={glowRef}
            className="w-full timeline-line rounded-full"
            style={{ height: "0%" }}
          />
        </div>

        {/* Mobile Line */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-surface/5 md:hidden">
          <div className="w-full h-full timeline-line rounded-full" />
        </div>

        {/* Milestones */}
        <div className="space-y-16 md:space-y-24">
          {TIMELINE.map((milestone, index) => (
            <TimelineMilestone
              key={milestone.title}
              milestone={milestone}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TimelineMilestoneProps {
  milestone: (typeof TIMELINE)[number];
  index: number;
  isLeft: boolean;
}

function TimelineMilestone({
  milestone,
  index,
  isLeft,
}: TimelineMilestoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-center gap-8 md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      variants={isLeft ? fadeInLeft : fadeInRight}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay: index * 0.1 }}
    >
      {/* Content */}
      <div
        className={`flex-1 ml-14 md:ml-0 ${
          isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
        }`}
      >
        <motion.div
          className="glass rounded-3xl p-6 md:p-8 group cursor-default hover:border-accent/30 transition-all duration-500"
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
        >
          {/* Year Badge */}
          <span className="inline-block px-3 py-1 text-xs font-bold text-primary bg-accent rounded-full mb-4">
            {milestone.year}
          </span>

          {/* Milestone Image */}
          <div className="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-primary-light to-primary">
            <img
              src={milestone.image}
              alt={milestone.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              loading="lazy"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
            
            {/* Floating glassmorphic emoji badge */}
            <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-primary/80 border border-accent/30 flex items-center justify-center text-xl backdrop-blur-md group-hover:border-accent/60 transition-colors duration-300">
              {milestone.icon}
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="font-heading text-xl md:text-2xl font-bold text-surface mb-2">
            {milestone.title}
          </h3>
          <p className="text-muted text-sm md:text-base leading-relaxed">
            {milestone.description}
          </p>
        </motion.div>
      </div>

      {/* Center Dot */}
      <motion.div
        className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10"
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="w-5 h-5 rounded-full bg-accent shadow-[0_0_20px_rgba(250,204,21,0.5)] border-4 border-primary" />
      </motion.div>

      {/* Spacer for desktop alternating layout */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}
