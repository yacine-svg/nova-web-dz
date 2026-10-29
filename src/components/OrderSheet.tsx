"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { site } from "@/config/site";
import { formatDA } from "@/lib/pricing";
import { buildMessage, normalizePhone, whatsappLink } from "@/lib/whatsapp";
import { getLenis, prefersReducedMotion } from "@/lib/scroll";
import { useSelection } from "./SelectionProvider";
import { Fx } from "./Glass";
import { CloseIcon, WhatsAppIcon } from "./Icons";
import Addons from "./Addons";

type Errors = { name?: string; phone?: string };

export default function OrderSheet() {
  const { sheetOpen, closeSheet, totals } = useSelection();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Open: mount, then animate in
  useEffect(() => {
    if (sheetOpen) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setSentUrl(null);
      setErrors({});
      setMounted(true);
      getLenis()?.stop();
      document.documentElement.classList.add("sheet-open");
    }
  }, [sheetOpen]);

  useEffect(() => {
    if (!mounted || !sheetOpen) return;
    const reduce = prefersReducedMotion();
    gsap.killTweensOf([overlayRef.current, panelRef.current]);
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.35, ease: "power2.out" });
    // panel moves and scales only: fading it would switch off its backdrop blur mid-animation
    gsap.fromTo(
      panelRef.current,
      { y: 60, scale: 0.94 },
      { y: 0, scale: 1, duration: reduce ? 0 : 0.8, ease: "elastic.out(1, 0.8)" },
    );
    const t = window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(t);
  }, [mounted, sheetOpen]);

  // Close: animate out, then unmount
  useEffect(() => {
    if (sheetOpen || !mounted) return;
    const reduce = prefersReducedMotion();
    gsap.to(overlayRef.current, { opacity: 0, duration: reduce ? 0 : 0.25 });
    gsap.to(panelRef.current, {
      y: 80,
      scale: 0.96,
      duration: reduce ? 0 : 0.3,
      ease: "power2.in",
      onComplete: () => {
        setMounted(false);
        getLenis()?.start();
        document.documentElement.classList.remove("sheet-open");
        returnFocus.current?.focus({ preventScroll: true });
      },
    });
  }, [sheetOpen, mounted]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
      if (e.key === "Tab" && panelRef.current) {
        // keep keyboard focus inside the sheet
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen, closeSheet]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 3) next.name = "Entrez votre nom et prénom.";
    const local = normalizePhone(phone);
    if (!local) next.phone = "Entrez un numéro algérien valide, par exemple 0551 23 45 67.";
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.phone || !local) return phoneRef.current?.focus();

    const text = buildMessage(totals, { name, phone: local, wilaya, note });
    const url = whatsappLink(site.whatsapp, text);
    const win = window.open(url, "_blank");
    if (!win) window.location.href = url;
    setSentUrl(url);
  };

  if (!mounted) return null;

  return (
    <div className="sheet" role="presentation">
      <div className="sheet__overlay" ref={overlayRef} onClick={closeSheet} />
      <div
        className="sheet__panel glass glass--edge"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
      >
        <Fx />
        <div className="sheet__scroll" data-lenis-prevent>
          <div className="sheet__head">
            <h2 id="sheet-title" className="sheet__title">
              {sentUrl ? "WhatsApp est ouvert" : "Vos coordonnées"}
            </h2>
            <button type="button" className="sheet__close glass" onClick={closeSheet} aria-label="Fermer">
              <Fx />
              <CloseIcon />
            </button>
          </div>

          {sentUrl ? (
            <div className="sheet__done">
              <p>
                Votre demande est écrite dans WhatsApp. Appuyez sur envoyer dans WhatsApp pour nous la transmettre&nbsp;;
                on vous répond sur ce numéro.
              </p>
              <a className="btn btn--whatsapp btn--block" href={sentUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                Rouvrir WhatsApp
              </a>
              <button type="button" className="btn btn--glass glass btn--block" onClick={closeSheet}>
                <Fx />
                Fermer
              </button>
            </div>
          ) : (
            <>
              <div className="recap">
                <ul className="recap__list">
                  {totals.items.map((s) => (
                    <li key={s.id}>
                      <span>{s.name}</span>
                      <span className="num">
                        {s.from ? "dès " : ""}
                        {formatDA(s.price)}
                      </span>
                    </li>
                  ))}
                  {totals.addonItems.map((a) => (
                    <li key={a.id} className="recap__addon">
                      <span>{a.name}</span>
                      <span className="num">
                        + {formatDA(a.price)}
                        {a.monthly ? " / mois" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="recap__total">
                  <span>{totals.hasFrom ? "Total, à partir de" : "Total estimé"}</span>
                  <strong className="num">{formatDA(totals.oneTime)}</strong>
                </div>
              </div>

              <Addons className="addons--sheet" />

              <form className="form" onSubmit={onSubmit} noValidate>
                <div className="field">
                  <label htmlFor="f-name">Nom complet</label>
                  <input
                    id="f-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    placeholder="Ex. Amine Benali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "f-name-err" : undefined}
                  />
                  {errors.name && (
                    <span id="f-name-err" className="field__error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="f-phone">Numéro de téléphone</label>
                  <input
                    id="f-phone"
                    ref={phoneRef}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="05 / 06 / 07 …"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "f-phone-err" : undefined}
                  />
                  {errors.phone && (
                    <span id="f-phone-err" className="field__error">
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="f-wilaya">
                    Wilaya <span className="field__opt">facultatif</span>
                  </label>
                  <input
                    id="f-wilaya"
                    type="text"
                    autoComplete="address-level1"
                    placeholder="Ex. Constantine"
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="f-note">
                    Votre activité <span className="field__opt">facultatif</span>
                  </label>
                  <textarea
                    id="f-note"
                    rows={2}
                    placeholder="Ex. Salon de coiffure à Alger, je veux montrer mes prix"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn--whatsapp btn--block">
                  <WhatsAppIcon />
                  Continuer sur WhatsApp
                </button>
                <p className="form__hint">
                  WhatsApp s&apos;ouvre avec votre demande déjà écrite. Il vous reste à appuyer sur envoyer.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
