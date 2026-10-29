"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Every scroll animation on the page, in and out. Runs on top of Lenis (see SmoothScroll).
 *
 * Markup hooks:
 *  [data-fx="section"]  section content tilts up into place and tilts away when you leave (scrubbed)
 *  [data-fx="title"]    words rise out of masks, sink back when the title leaves (SplitTitle)
 *  [data-fx="fade"]     text unblurs and rises in, blurs out on the way out (data-fx-delay="0.1")
 *  glass cards          pop in like drops, shrink away when they leave
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

        /* ---------- sections: tilt in, tilt away ---------- */
        gsap.utils.toArray<HTMLElement>("[data-fx='section']").forEach((wrap) => {
          const section = wrap.closest("section") ?? wrap;
          const hidden = desktop ? { y: 160, scale: 0.88, rotationX: 16 } : { y: 70, scale: 0.95, rotationX: 0 };
          const gone = desktop ? { y: -110, scale: 0.9, rotationX: -12 } : { y: -40, scale: 0.96, rotationX: 0 };
          const rest = { y: 0, scale: 1, rotationX: 0 };
          gsap.set(wrap, { transformPerspective: 1600, transformOrigin: "50% 50%" });

          gsap.fromTo(wrap, hidden, {
            ...rest,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "top 40%", scrub: 0.8 },
          });
          gsap.fromTo(wrap, rest, {
            ...gone,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "bottom 55%", end: "bottom top", scrub: 0.8 },
          });
        });

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
            { y: 40, opacity: 0, filter: "blur(12px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1,
              delay: Number(el.dataset.fxDelay || 0),
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 92%", end: "bottom 10%", toggleActions: "play reverse play reverse" },
            },
          );
        });

        /* ---------- glass cards: pop in like drops, shrink away ---------- */
        const drops = (selector: string, hiddenState: gsap.TweenVars, goneState: gsap.TweenVars, stagger = 0.08) => {
          const els = gsap.utils.toArray<HTMLElement>(selector);
          if (!els.length) return;
          const rest = { x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotation: 0, rotationX: 0 };
          gsap.set(els, { transformPerspective: 900, ...hiddenState });
          ScrollTrigger.batch(els, {
            start: "top 94%",
            end: "bottom 22%",
            onEnter: (batch) =>
              gsap.to(batch, { ...rest, duration: 1.2, stagger, ease: "elastic.out(1, 0.72)", overwrite: true }),
            onEnterBack: (batch) =>
              gsap.to(batch, { ...rest, duration: 1.1, stagger: stagger * 0.6, ease: "elastic.out(1, 0.72)", overwrite: true }),
            onLeave: (batch) =>
              gsap.to(batch, { ...goneState, duration: 0.55, stagger: stagger * 0.5, ease: "power2.in", overwrite: true }),
            onLeaveBack: (batch) =>
              gsap.to(batch, { ...hiddenState, duration: 0.55, stagger: stagger * 0.5, ease: "power2.in", overwrite: true }),
          });
        };

        drops(
          ".tile",
          { y: 110, scale: 0.55, rotation: (i: number) => (i % 2 ? 5 : -5) },
          { y: -60, scale: 0.75, rotation: (i: number) => (i % 2 ? -4 : 4) },
        );
        drops(".seg", { y: 30, scale: 0.6 }, { y: -20, scale: 0.8 });
        drops(".steps__num", { scale: 0, rotation: -90 }, { scale: 0.3, rotation: 90 }, 0.14);
        drops(".faq__item", { y: 80, scale: 0.9, rotationX: -35 }, { y: -40, scale: 0.92, rotationX: 25 }, 0.07);
        drops(".footer__bar", { y: 50, scaleX: 0.55, scaleY: 0.7 }, { y: 0, scaleX: 0.9, scaleY: 0.9 });

        /* ---------- summary: sticky, so it follows the whole picker rather than its own position ---------- */
        const summary = document.querySelector(".summary");
        const layout = document.querySelector(".services__layout");
        if (summary && layout) {
          const away = { y: 120, scale: 0.8, rotationX: 20 };
          const here = { y: 0, scale: 1, rotationX: 0 };
          gsap.set(summary, { transformPerspective: 900, ...away });
          ScrollTrigger.create({
            trigger: layout,
            start: "top 80%",
            end: "bottom 35%",
            onEnter: () => gsap.to(summary, { ...here, duration: 1.2, ease: "elastic.out(1, 0.72)", overwrite: true }),
            onEnterBack: () => gsap.to(summary, { ...here, duration: 1.1, ease: "elastic.out(1, 0.72)", overwrite: true }),
            onLeave: () => gsap.to(summary, { y: -40, scale: 0.9, duration: 0.5, ease: "power2.in", overwrite: true }),
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
              { xPercent: fromLeft ? -18 : 18, opacity: 0, filter: "blur(10px)", duration: 0.9, ease: "power3.out" },
              0.1,
            )
            .from(item.querySelectorAll(".examples__label, .examples__url"), { y: 24, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.25)
            .from(item.querySelector(".examples__go-pop"), { scale: 0, rotation: -140, duration: 1, ease: "elastic.out(1, 0.6)" }, 0.3);
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
