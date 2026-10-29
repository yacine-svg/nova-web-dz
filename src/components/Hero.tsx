"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToId, prefersReducedMotion } from "@/lib/scroll";
import { Fx } from "./Glass";

gsap.registerPlugin(ScrollTrigger);

const lines = ["Choisissez.", "Voyez le prix.", "Écrivez-nous."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // One orchestrated entrance: lines rise out of their masks, then the glass drops land
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__line-inner", { yPercent: 115, duration: 1.15, stagger: 0.1 }).from(
        ".hero__orb",
        { scale: 0, duration: 1.5, stagger: 0.14, ease: "elastic.out(1, 0.5)" },
        0.45,
      );

      // Slow idle float
      gsap.utils.toArray<HTMLElement>(".hero__orb").forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 ? 16 : -18,
          rotation: i % 2 ? -6 : 6,
          duration: 4.5 + i * 1.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // Drops drift up at different speeds while the page scrolls
      gsap.utils.toArray<HTMLElement>(".hero__orb-track").forEach((track, i) => {
        gsap.to(track, {
          y: -140 * (i + 1),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      });
    }, el);

    // Drops follow the pointer a little
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const followers = finePointer
      ? gsap.utils.toArray<HTMLElement>(".hero__orb-follow", el).map((node, i) => ({
          depth: (i + 1) * 16,
          x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3" }),
          y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3" }),
        }))
      : [];
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      followers.forEach((f) => {
        f.x(nx * f.depth);
        f.y(ny * f.depth);
      });
    };
    if (finePointer) window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

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

        <div className="hero__orbs" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`hero__orb-track hero__orb-track--${n}`}>
              <div className="hero__orb-follow">
                <div className="hero__orb glass glass--lens">
                  <Fx />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hero__foot">
          <p className="hero__lead">
            Nova Web Dz crée des sites web, des applications et des visuels pour les commerces et les entreprises en
            Algérie. Composez votre demande en deux minutes&nbsp;: le tarif s&apos;affiche en dinars, et la suite se
            règle sur WhatsApp.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={() => scrollToId("services")}>
              Composer mon projet
            </button>
            <button type="button" className="btn btn--glass glass" onClick={() => scrollToId("exemples")}>
              <Fx />
              Voir des exemples
            </button>
          </div>
          <ul className="hero__facts" aria-label="En bref">
            <li>Tarifs affichés en DA</li>
            <li>Paiement par BaridiMob</li>
            <li>Suivi sur WhatsApp</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
