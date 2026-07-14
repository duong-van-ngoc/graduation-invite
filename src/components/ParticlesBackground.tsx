"use client";

import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground() {
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#FACC15", "#F59E0B", "#FDE68A"],
        },
        move: {
          enable: true,
          speed: 0.6,
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: {
            default: "out" as const,
          },
        },
        number: {
          value: 60,
          density: {
            enable: true,
          },
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        links: {
          enable: false,
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <Particles
      id="graduation-particles"
      className="absolute inset-0 z-0"
      options={options}
    />
  );
}
