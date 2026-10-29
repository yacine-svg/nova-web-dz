"use client";

import { useEffect } from "react";

/**
 * Displacement maps for the refraction effect.
 * Red encodes horizontal offset, green vertical offset; rgb(128,128,0) means "no offset".
 * The two gradients are added inside the filter (no blend modes, which images don't render reliably).
 */
const uri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
const wrap = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">${body}</svg>`;

const RED_X = uri(
  wrap(
    '<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/>',
  ),
);
const GREEN_Y = uri(
  wrap(
    '<defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/>',
  ),
);
/** Neutral centre so only the rim bends the light, like a real glass edge */
const NEUTRAL_CENTER = uri(
  wrap(
    '<defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter></defs><rect x="16" y="16" width="68" height="68" rx="26" fill="rgb(128,128,0)" filter="url(#b)"/>',
  ),
);

export default function LiquidFilters() {
  useEffect(() => {
    // SVG filters on backdrops only render correctly in Chromium. Safari and Firefox keep the frosted glass.
    const nav = navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } };
    const isChromium =
      !!nav.userAgentData?.brands?.some((b) => /Chromium|Google Chrome|Microsoft Edge|Opera/.test(b.brand)) ||
      (/Chrome\//.test(navigator.userAgent) && !/Edg\/|OPR\//.test(navigator.userAgent) && "chrome" in window);
    const reduceTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
    if (isChromium && !reduceTransparency) document.documentElement.classList.add("refract");
    return () => document.documentElement.classList.remove("refract");
  }, []);

  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="lg-edge" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feImage href={RED_X} preserveAspectRatio="none" result="rx" />
          <feImage href={GREEN_Y} preserveAspectRatio="none" result="gy" />
          <feComposite in="rx" in2="gy" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="ramp" />
          <feImage href={NEUTRAL_CENTER} preserveAspectRatio="none" result="calm" />
          <feComposite in="calm" in2="ramp" operator="over" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="-40" xChannelSelector="R" yChannelSelector="G" result="bent" />
          <feGaussianBlur in="bent" stdDeviation="0.5" />
        </filter>
        {/* lens: offsets are a fraction of the element's size, so every drop magnifies the same amount */}
        <filter id="lg-lens" x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
          <feImage href={RED_X} preserveAspectRatio="none" result="rx" />
          <feImage href={GREEN_Y} preserveAspectRatio="none" result="gy" />
          <feComposite in="rx" in2="gy" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="-0.24" xChannelSelector="R" yChannelSelector="G" result="bent" />
          <feGaussianBlur in="bent" stdDeviation="0.002" />
        </filter>
      </defs>
    </svg>
  );
}
