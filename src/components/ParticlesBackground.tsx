"use client";

import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

export default function ParticlesBackground() {
  const { lowPower, reduceMotion } = useDevicePerformance();

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: lowPower ? 24 : 45,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      particles: {
        color: {
          value: ["#FACC15", "#F59E0B", "#FDE68A"],
        },
        move: {
          enable: !reduceMotion,
          speed: lowPower ? 0.25 : 0.45,
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: {
            default: "out" as const,
          },
        },
        number: {
          value: lowPower ? 18 : 42,
          density: {
            enable: true,
          },
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: {
            enable: !lowPower && !reduceMotion,
            speed: 0.35,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: !lowPower && !reduceMotion,
            speed: 0.6,
            sync: false,
          },
        },
        links: {
          enable: !lowPower,
          color: "#FACC15",
          distance: 120,
          opacity: 0.12,
          width: 0.8,
        },
      },
      detectRetina: !lowPower,
    }),
    [lowPower, reduceMotion]
  );

  return (
    <Particles
      id="graduation-particles"
      className="absolute inset-0 z-0"
      options={options}
    />
  );
}
