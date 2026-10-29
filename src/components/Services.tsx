"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories, services } from "@/config/site";
import { formatDA } from "@/lib/pricing";
import { useLiquidBlob } from "@/lib/useLiquidBlob";
import { prefersReducedMotion } from "@/lib/scroll";
import { useSelection } from "./SelectionProvider";
import { Fx } from "./Glass";
import { CheckIcon, CloseIcon, PlusIcon } from "./Icons";
import AnimatedNumber from "./AnimatedNumber";
import Addons from "./Addons";
import SplitTitle from "./SplitTitle";

export default function Services() {
  const { selected, toggleService, removeService, totals, openSheet, filter, setFilter } = useSelection();
  const tilesRef = useRef<HTMLDivElement>(null);
  const firstFilter = useRef(true);

  const segRef = useRef<HTMLDivElement>(null);
  const segBlobRef = useRef<HTMLSpanElement>(null);
  useLiquidBlob(segRef, segBlobRef, filter);

  const count = totals.items.length;

  // Changing the filter: re-measure scroll positions, then the visible tiles bounce back in
  useEffect(() => {
    if (firstFilter.current) {
      firstFilter.current = false;
      return;
    }
    ScrollTrigger.refresh();
    if (prefersReducedMotion() || !tilesRef.current) return;
    const shown = tilesRef.current.querySelectorAll(".tile:not([hidden])");
    gsap.fromTo(
      shown,
      { scale: 0.6, y: 40, rotation: (i: number) => (i % 2 ? 3 : -3) },
      { scale: 1, y: 0, rotation: 0, duration: 1, stagger: 0.06, ease: "elastic.out(1, 0.7)", overwrite: true },
    );
  }, [filter]);

  const onTile = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    toggleService(id);
    if (prefersReducedMotion()) return;
    const tile = e.currentTarget;
    gsap.fromTo(tile, { scale: 0.965 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    const check = tile.querySelector(".tile__check");
    if (check) gsap.fromTo(check, { scale: 0.4, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <section id="services" className="section services">
      <div className="wrap" data-fx="section">
        <div className="section__head services__head">
          <div>
            <SplitTitle className="section__title" text="Composez votre projet" />
            <p className="section__lead" data-fx="fade">
              Touchez un ou plusieurs services pour les ajouter. Les prix sont des tarifs de départ en dinars&nbsp;; le
              prix final est confirmé avec vous sur WhatsApp.
            </p>
          </div>

          <div className="seg glass" role="group" aria-label="Filtrer les services">
            <Fx />
            <div className="seg__inner" ref={segRef}>
              <span className="seg__blob glass glass--lens" ref={segBlobRef} aria-hidden="true">
                <Fx />
              </span>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-key={c.id}
                  className={`seg__btn ${filter === c.id ? "is-active" : ""}`}
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="services__layout">
          <div className="tiles" ref={tilesRef}>
            {services.map((s) => {
              const on = selected.includes(s.id);
              // all tiles stay in the page (hidden when filtered out) so scroll animations keep track of them
              const shown = filter === "all" || s.category === filter;
              return (
                <button
                  key={s.id}
                  type="button"
                  hidden={!shown}
                  className={`tile glass tile--${s.size} ${on ? "is-on" : ""}`}
                  aria-pressed={on}
                  onClick={onTile(s.id)}
                >
                  <Fx />
                  <span className="tile__top">
                    <span className="tile__name">{s.name}</span>
                    <span className="tile__check" aria-hidden="true">
                      {on ? <CheckIcon /> : <PlusIcon />}
                    </span>
                  </span>
                  <span className="tile__blurb">{s.blurb}</span>
                  <span className="tile__includes">
                    {s.includes.map((item) => (
                      <span key={item} className="tile__include">
                        {item}
                      </span>
                    ))}
                  </span>
                  <span className="tile__foot">
                    <span className="tile__price">
                      {s.from && <small>à partir de</small>}
                      <span className="num">{formatDA(s.price)}</span>
                    </span>
                    <span className="tile__delay">Délai&nbsp;: {s.delay}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <aside className="summary glass glass--edge" aria-label="Votre sélection">
            <Fx />
            <h3 className="summary__title">Votre sélection</h3>
            <div aria-live="polite">
              {count === 0 ? (
                <p className="summary__empty">Rien pour l&apos;instant. Touchez un service à gauche pour l&apos;ajouter.</p>
              ) : (
                <ul className="summary__list">
                  {totals.items.map((s) => (
                    <li key={s.id} className="summary__item">
                      <span className="summary__name">{s.name}</span>
                      <span className="summary__price num">
                        {s.from ? "dès " : ""}
                        {formatDA(s.price)}
                      </span>
                      <button
                        type="button"
                        className="summary__remove"
                        aria-label={`Retirer ${s.name}`}
                        onClick={() => removeService(s.id)}
                      >
                        <CloseIcon size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Addons />

            <div className="summary__total">
              <span className="summary__total-label">{totals.hasFrom ? "Total, à partir de" : "Total estimé"}</span>
              <strong className="summary__total-value">
                <AnimatedNumber value={totals.oneTime} />
              </strong>
              {totals.monthly > 0 && <span className="summary__monthly">puis {formatDA(totals.monthly)} / mois</span>}
            </div>

            <button type="button" className="btn btn--primary btn--block" disabled={count === 0} onClick={openSheet}>
              Continuer
            </button>
          </aside>
        </div>
      </div>

      {/* Phone: floating bubble with the total */}
      <div className={`mbar ${count > 0 ? "is-on" : ""}`} aria-hidden={count === 0}>
        <div className="mbar__pill glass glass--edge">
          <Fx />
          <span className="mbar__info">
            <span className="mbar__count">
              {count} service{count > 1 ? "s" : ""}
            </span>
            <strong className="mbar__total">
              {totals.hasFrom ? "dès " : ""}
              <AnimatedNumber value={totals.oneTime} />
            </strong>
          </span>
          <button type="button" className="btn btn--primary btn--sm" onClick={openSheet} tabIndex={count > 0 ? 0 : -1}>
            Continuer
          </button>
        </div>
      </div>
    </section>
  );
}
