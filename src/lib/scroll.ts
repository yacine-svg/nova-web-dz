import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Smooth-scroll to a section id, with room for the floating navbar */
export function scrollToId(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(id === "top" ? 0 : el, { offset: -96, duration: 1.4 });
  } else {
    const y = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}
