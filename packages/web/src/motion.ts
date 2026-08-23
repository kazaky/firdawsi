import { useEffect, useState } from "react";
import { sampleSpring, spring, type SpringName } from "@firdawsi/tokens";

export type { SpringName };

export function albercaCss(name: SpringName = "settle"): {
  transitionDuration: string;
  transitionTimingFunction: string;
} {
  const spec = spring(name);
  return {
    transitionDuration: `${spec.durationMs}ms`,
    transitionTimingFunction: "var(--firdawsi-motion-easing-emphasis)",
  };
}

/**
 * Samples an Alberca spring from 0 to 1. Reduced motion jumps to rest.
 */
export function useAlbercaSpring(name: SpringName, active: boolean): number {
  const [progress, setProgress] = useState(active ? 1 : 0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(active ? 1 : 0);
      return;
    }

    const spec = spring(name);
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / spec.durationMs);
      const sampled = sampleSpring(name, t);
      setProgress(active ? sampled : 1 - sampled);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, name]);

  return progress;
}
