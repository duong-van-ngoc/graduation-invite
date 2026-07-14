"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ParticlesWrapper from "@/components/ParticlesWrapper";
import HeroSection from "@/components/HeroSection";
import EnvelopeAnimation from "@/components/EnvelopeAnimation";
import InvitationCard from "@/components/InvitationCard";
import CountdownSection from "@/components/CountdownSection";
import MapSection from "@/components/MapSection";
import WishSection from "@/components/WishSection";
import FooterSection from "@/components/FooterSection";

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);

  const handleEnvelopeComplete = () => {
    setShowContent(true);
  };

  return (
    <ParticlesWrapper>
      <main className="relative">
        {!showContent ? (
          <EnvelopeAnimation onComplete={handleEnvelopeComplete} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Hero Section - now part of the main landing content */}
            <HeroSection />

            {/* Divider */}
            <div className="relative h-32">
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            </div>

            <InvitationCard />

            <CountdownSection />

            {/* Divider */}
            <div className="relative h-16">
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            </div>

            <MapSection />

            {/* Divider */}
            <div className="relative h-16">
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            </div>

            <WishSection />

            <FooterSection />
          </motion.div>
        )}
      </main>
    </ParticlesWrapper>
  );
}
