import { useEffect, useRef, useState } from "react";

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function AnimatedCounter({
  end,
  duration = 1000,
  format = (n) => n,
}) {
  const [display, setDisplay] = useState(reducedMotion ? end : 0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const prevEnd = useRef(end);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(end);
      prevEnd.current = end;
      return;
    }

    if (prevEnd.current !== end) {
      startRef.current = null;
    }

    prevEnd.current = end;

    const animate = (timestamp) => {
      if (startRef.current === null) {
        startRef.current = timestamp;
      }

      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);

      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration]);

  return <>{format(display)}</>;
}
