"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { offers } from "@/config/site";
import { scrollToId, prefersReducedMotion } from "@/lib/scroll";
import { useSelection } from "./SelectionProvider";
import { Fx } from "./Glass";

gsap.registerPlugin(ScrollTrigger);

const lines = ["Choisissez.", "Voyez le prix.", "Écrivez-nous."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { setFilter } = useSelection();

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // In: lines rise out of their masks, then the rest lands
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__line-inner", { yPercent: 118, rotation: 4, duration: 1.2, stagger: 0.11 })
        .from(".hero__lead", { y: 40, opacity: 0, duration: 1 }, 0.55)
        // wrappers, not the buttons: the buttons have a CSS hover transition on transform that would fight GSAP
        .from(".hero__actions .pop", { scale: 0.5, y: 30, duration: 1.2, stagger: 0.1, ease: "elastic.out(1, 0.6)" }, 0.7)
        .from(".hero__offers > li", { scale: 0.4, y: 40, duration: 1.2, stagger: 0.09, ease: "elastic.out(1, 0.65)" }, 0.8);

      // Out: the three lines slide apart and the rest drifts up as you scroll away
      const out = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom 15%", scrub: 0.7 },
        defaults: { ease: "none" },
      });
      // Exit tweens target the wrappers, entrance tweens the inner pieces, so the two never fight
      out
        .to(".hero__line--1", { xPercent: -22, opacity: 0 }, 0)
        .to(".hero__line--2", { xPercent: 18, opacity: 0 }, 0)
        .to(".hero__line--3", { xPercent: -14, opacity: 0 }, 0)
        .to(".hero__title", { scale: 0.9, transformOrigin: "50% 0%" }, 0)
        .to(".hero__lead-wrap", { y: -70, opacity: 0 }, 0)
        // glass pieces move and shrink, they don't fade (fading switches off their blur)
        .to(".hero__actions", { y: -90, scale: 0.88, transformOrigin: "100% 100%" }, 0)
        .to(".hero__offers", { y: -130, scale: 0.9, transformOrigin: "0% 100%" }, 0);
    }, el);

    return () => ctx.revert();
  }, []);

  const pick = (category: (typeof offers)[number]["category"]) => {
    setFilter(category);
    scrollToId("services");
  };

  return (
    <section id="top" className="hero" ref={root}>
      <div className="wrap hero__inner">
        <h1 className="hero__title" aria-label="Choisissez. Voyez le prix. Écrivez-nous.">
          {lines.map((line, i) => (
            <span key={line} className={`hero__line hero__line--${i + 1}`} aria-hidden="true">
              <span className="hero__line-inner">{line}</span>
            </span>
          ))}
        </h1>

        <div className="hero__foot">
          <div className="hero__lead-wrap">
            <p className="hero__lead">
            Sites web et systèmes sur mesure, logos, présentations, montage vidéo et mise en page de rapports PFE, pour
            les entreprises et les étudiants en Algérie. Composez votre demande&nbsp;: le tarif s&apos;affiche en dinars,
            et la suite se règle sur WhatsApp.
            </p>
          </div>
          <div className="hero__actions">
            <span className="pop">
              <button type="button" className="btn btn--primary" onClick={() => scrollToId("services")}>
                Composer mon projet
              </button>
            </span>
            <span className="pop">
              <button type="button" className="btn btn--glass glass" onClick={() => scrollToId("exemples")}>
                <Fx />
                Voir des exemples
              </button>
            </span>
          </div>
          <ul className="hero__offers" aria-label="Ce que fait Nova Web Dz">
            {offers.map((o) => (
              <li key={o.category}>
                <button type="button" className="offer glass" onClick={() => pick(o.category)}>
                  <Fx />
                  <span className="offer__emoji" aria-hidden="true">
                    {o.emoji}
                  </span>
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
