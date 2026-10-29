"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { formatDA } from "@/lib/pricing";
import { prefersReducedMotion } from "@/lib/scroll";

/** Total that rolls to its new value instead of jumping */
export default function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ v: value });
  // React renders the first value only; GSAP updates the text node afterwards
  const [initial] = useState(() => formatDA(value));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const write = () => {
      const text = formatDA(current.current.v);
      if (node.firstChild) node.firstChild.nodeValue = text;
      else node.textContent = text;
    };
    const tween = gsap.to(current.current, {
      v: value,
      duration: prefersReducedMotion() ? 0 : 0.7,
      ease: "power3.out",
      onUpdate: write,
      onComplete: write,
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className="num">
      {initial}
    </span>
  );
}
