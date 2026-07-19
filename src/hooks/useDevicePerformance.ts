"use client";

import { useEffect, useState } from "react";

export function useDevicePerformance() {
  const [state, setState] = useState({
    isMobile: false,
    reduceMotion: false,
    lowPower: false,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const cores = navigator.hardwareConcurrency || 4;
      const deviceNavigator = navigator as Navigator & {
        deviceMemory?: number;
      };
      const lowMemory =
        typeof deviceNavigator.deviceMemory === "number" &&
        deviceNavigator.deviceMemory <= 4;

      setState({
        isMobile: mobileQuery.matches,
        reduceMotion: motionQuery.matches,
        lowPower: mobileQuery.matches || cores <= 4 || lowMemory,
      });
    };

    update();
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return state;
}
