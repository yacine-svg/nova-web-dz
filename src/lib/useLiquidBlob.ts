"use client";

import { useCallback, useEffect, type RefObject } from "react";
import gsap from "gsap";

/**
 * A glass "droplet" that slides between items with a jelly stretch.
 * Items inside the container need a `data-key` attribute.
 */
export function useLiquidBlob(
  containerRef: RefObject<HTMLElement | null>,
  blobRef: RefObject<HTMLElement | null>,
  restingKey: string | null,
) {
  const moveTo = useCallback(
    (key: string | null, instant = false) => {
      const container = containerRef.current;
      const blob = blobRef.current;
      if (!container || !blob) return;

      const target = key ? container.querySelector<HTMLElement>(`[data-key="${key}"]`) : null;
      if (!target) {
        gsap.to(blob, { scaleX: 0.4, scaleY: 0, duration: instant ? 0 : 0.35, ease: "power3.in" });
        return;
      }

      const box = { x: target.offsetLeft, y: target.offsetTop, width: target.offsetWidth, height: target.offsetHeight };
      if (instant) {
        gsap.set(blob, { ...box, scaleX: 1, scaleY: 1 });
        return;
      }

      const wasHidden = blob.offsetWidth < 2 || Number(gsap.getProperty(blob, "scaleY")) < 0.1;
      if (wasHidden) gsap.set(blob, { ...box });

      gsap.to(blob, { ...box, scaleX: 1, duration: 0.8, ease: "elastic.out(1, 0.62)", overwrite: "auto" });
      // squash and stretch while it travels
      gsap.fromTo(blob, { scaleY: wasHidden ? 0 : 0.78 }, { scaleY: 1, duration: 0.75, ease: "elastic.out(1.1, 0.38)" });
    },
    [containerRef, blobRef],
  );

  useEffect(() => {
    moveTo(restingKey);
  }, [restingKey, moveTo]);

  useEffect(() => {
    const onResize = () => moveTo(restingKey, true);
    window.addEventListener("resize", onResize);
    // fonts can change widths after first paint
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [restingKey, moveTo]);

  return moveTo;
}
