"use client";

import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import { useCallback, type ReactNode } from "react";

interface ParticlesWrapperProps {
  children: ReactNode;
}

export default function ParticlesWrapper({ children }: ParticlesWrapperProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <ParticlesProvider init={particlesInit}>
      {children}
    </ParticlesProvider>
  );
}
