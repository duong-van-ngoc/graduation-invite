"use client";

import { useCallback, type ReactNode } from "react";
import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

interface ParticlesLayerProps {
  children?: ReactNode;
}

export default function ParticlesLayer({ children }: ParticlesLayerProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return <ParticlesProvider init={particlesInit}>{children}</ParticlesProvider>;
}
