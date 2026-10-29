"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Every scroll animation on the page, in and out. Runs on top of Lenis (see SmoothScroll).
 *
 * Markup hooks:
 *  [data-fx="title"]    words rise out of masks, sink back when the title leaves (SplitTitle)
 *  [data-fx="fade"]     text rises in, sinks out on the way out (data-fx-delay="0.1")
 *  glass cards          rise in softly, ease away when they leave
 *
 * Glass elements are only moved and scaled, never faded: below opacity 1 a browser drops their blur.
 * Never animate an element whose CSS has `transition: transform` (hover effects): animate a wrapper instead.
 */
export default function ScrollFX() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const desktop = !!context.conditions?.desktop;
        const motion = !!context.conditions?.motion;
        if (!motion) return;

        /* ---------- titles: masked words ---------- */
        gsap.utils.toArray<HTMLElement>("[data-fx='title']").forEach((title) => {
          gsap.fromTo(
            title.querySelectorAll(".sw__i"),
            { yPercent: 120, rotation: 8 },
            {
              yPercent: 0,
              rotation: 0,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.07,
              scrollTrigger: { trigger: title, start: "top 88%", end: "bottom 12%", toggleActions: "play reverse play reverse" },
            },
          );
        });

        /* ---------- text: unblur in, blur out ---------- */
        gsap.utils.toArray<HTMLElement>("[data-fx='fade']").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              delay: Number(el.dataset.fxDelay || 0),
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 92%", end: "bottom 10%", toggleActions: "play reverse play reverse" },
            },
          );
        });

        /* ---------- glass cards: rise in softly, ease away ----------
           Kept cheap on purpose: every glass card re-blurs what is behind it on each frame it moves,
           so cards only slide and scale a little, with a short calm ease, and never all at once. */
        const rise = (selector: string, distance = 60, stagger = 0.07) => {
          const els = gsap.utils.toArray<HTMLElement>(selector);
          if (!els.length) return;
          const hiddenState = { y: distance, scale: 0.97, opacity: 0 };
          const rest = { y: 0, scale: 1, opacity: 1 };
          gsap.set(els, hiddenState);
          ScrollTrigger.batch(els, {
            start: "top 92%",
            end: "bottom 18%",
            onEnter: (batch) => gsap.to(batch, { ...rest, duration: 0.75, stagger, ease: "power3.out", overwrite: true }),
            onEnterBack: (batch) => gsap.to(batch, { ...rest, duration: 0.6, stagger: stagger * 0.6, ease: "power3.out", overwrite: true }),
            onLeave: (batch) =>
              gsap.to(batch, { y: -distance * 0.5, scale: 0.98, opacity: 0, duration: 0.45, ease: "power2.in", overwrite: true }),
            onLeaveBack: (batch) => gsap.to(batch, { ...hiddenState, duration: 0.45, ease: "power2.in", overwrite: true }),
          });
        };

        rise(".tile");
        rise(".seg", 24);
        rise(".steps__num", 30, 0.12);
        rise(".faq__item", 40, 0.06);
        rise(".footer__bar", 30);

        /* ---------- summary: sticky, so it follows the whole picker rather than its own position ---------- */
        const summary = document.querySelector(".summary");
        const layout = document.querySelector(".services__layout");
        if (summary && layout) {
          const away = { y: 60, scale: 0.97, opacity: 0 };
          const here = { y: 0, scale: 1, opacity: 1 };
          gsap.set(summary, away);
          ScrollTrigger.create({
            trigger: layout,
            start: "top 80%",
            end: "bottom 35%",
            onEnter: () => gsap.to(summary, { ...here, duration: 0.8, ease: "power3.out", overwrite: true }),
            onEnterBack: () => gsap.to(summary, { ...here, duration: 0.6, ease: "power3.out", overwrite: true }),
            onLeave: () => gsap.to(summary, { y: -30, opacity: 0, duration: 0.45, ease: "power2.in", overwrite: true }),
            onLeaveBack: () => gsap.to(summary, { ...away, duration: 0.5, ease: "power2.in", overwrite: true }),
          });
        }

        /* ---------- steps: the connecting line draws itself with the scroll ---------- */
        const list = document.querySelector(".steps__list");
        if (list) {
          gsap.fromTo(
            ".steps__line",
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              stagger: 0.3,
              scrollTrigger: { trigger: list, start: "top 85%", end: "top 35%", scrub: 0.6 },
            },
          );
        }

        /* ---------- examples: each row slides in, its rule draws, the arrow pops ---------- */
        gsap.utils.toArray<HTMLElement>(".examples__item").forEach((item, i) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: item, start: "top 94%", end: "bottom 18%", toggleActions: "play reverse play reverse" },
          });
          const fromLeft = i % 2 === 0;
          tl.from(item.querySelector(".examples__rule"), { scaleX: 0, duration: 0.9, ease: "power3.inOut" })
            .from(
              item.querySelector(".examples__name"),
              { xPercent: fromLeft ? -10 : 10, opacity: 0, duration: 0.8, ease: "power3.out" },
              0.1,
            )
            .from(item.querySelectorAll(".examples__label, .examples__url"), { y: 24, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.25)
            .from(item.querySelector(".examples__go-pop"), { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(1.6)" }, 0.25);
        });
      },
    );

    // fonts change heights after first paint: re-measure once they are in
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

    return () => mm.revert();
  }, []);

  return null;
}
