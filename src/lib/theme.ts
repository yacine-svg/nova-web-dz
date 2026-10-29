"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { prefersReducedMotion } from "./scroll";

export type Theme = "light" | "dark";
import { THEME_KEY as KEY } from "./themeBoot";

function effectiveTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* private mode: the choice just isn't remembered */
  }
}

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

/** Current theme (follows the phone until the visitor picks one) and a toggle that reveals the new theme in a circle from the tap */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    setThemeState(effectiveTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setThemeState(effectiveTheme());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback((e?: MouseEvent) => {
    const next: Theme = effectiveTheme() === "dark" ? "light" : "dark";
    const swap = () => {
      applyTheme(next);
      setThemeState(next);
    };
    const doc = document as ViewTransitionDoc;
    if (!doc.startViewTransition || prefersReducedMotion() || !e) {
      swap();
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = doc.startViewTransition(swap);
    vt.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }, []);

  return { theme, toggle };
}
