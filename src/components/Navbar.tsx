"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { navLinks } from "@/config/site";
import { scrollToId } from "@/lib/scroll";
import { useLiquidBlob } from "@/lib/useLiquidBlob";
import { useSelection } from "./SelectionProvider";
import { Fx } from "./Glass";
import { MenuIcon, MoonIcon, NovaLogo, SunIcon } from "./Icons";
import { useTheme } from "@/lib/theme";

export default function Navbar() {
  const { selected, openSheet } = useSelection();
  const count = selected.length;

  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const linksRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const firstRender = useRef(true);

  const moveBlob = useLiquidBlob(linksRef, blobRef, active);
  const { theme, toggle: toggleTheme } = useTheme();
  const themeLabel = theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre";

  // Which section is on screen
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        const current = navLinks.find((l) => visible.get(l.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Compact bubble once the page moves
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Badge pops when the selection changes
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (countRef.current && count > 0) {
      gsap.fromTo(countRef.current, { scale: 0.3 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    }
  }, [count]);

  // Mobile menu bubble: grows out of the button, no opacity fade (keeps the glass blur alive)
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    if (menuOpen) {
      gsap.set(sheet, { display: "flex" });
      gsap.fromTo(sheet, { scale: 0.2, y: -16 }, { scale: 1, y: 0, duration: 0.75, ease: "elastic.out(1, 0.7)" });
    } else {
      gsap.to(sheet, {
        scale: 0.2,
        y: -16,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          // display:none, not visibility: a hidden element with an SVG filter still paints in Chromium
          gsap.set(sheet, { display: "none" });
        },
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToId(id);
  };

  const onCta = () => {
    setMenuOpen(false);
    if (count > 0) openSheet();
    else scrollToId("services");
  };

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav__bar glass glass--edge">
        <Fx />
        <a href="#top" className="nav__brand" onClick={go("top")} aria-label="Nova Web Dz, retour en haut">
          <span className="nav__logo glass">
            <Fx />
            <NovaLogo gradientId="nova-logo-nav" className="nav__logo-mark" />
          </span>
          <span className="nav__name">Nova Web Dz</span>
        </a>

        <nav aria-label="Navigation principale">
          <div className="nav__links" ref={linksRef} onPointerLeave={() => moveBlob(active)}>
            <span className="nav__blob glass glass--lens" ref={blobRef} aria-hidden="true">
              <Fx />
            </span>
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-key={l.id}
                className={`nav__link ${active === l.id ? "is-active" : ""}`}
                aria-current={active === l.id ? "true" : undefined}
                onPointerEnter={() => moveBlob(l.id)}
                onFocus={() => moveBlob(l.id)}
                onBlur={() => moveBlob(active)}
                onClick={go(l.id)}
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        <button type="button" className="nav__cta" onClick={onCta}>
          <span className="nav__cta-label">{count > 0 ? "Ma demande" : "Demander un devis"}</span>
          <span className="nav__cta-short">Devis</span>
          {count > 0 && (
            <span className="nav__count" ref={countRef} aria-label={`${count} service${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`}>
              {count}
            </span>
          )}
        </button>

        <button
          type="button"
          className="nav__round nav__theme glass"
          aria-label={theme ? themeLabel : "Changer de thème"}
          onClick={(e) => toggleTheme(e)}
        >
          <Fx />
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          type="button"
          className="nav__round nav__menu glass"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Fx />
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      <div id="menu-mobile" className="nav__sheet glass glass--edge" ref={sheetRef} aria-hidden={!menuOpen}>
        <Fx />
        {navLinks.map((l) => (
          <a key={l.id} href={`#${l.id}`} className="nav__sheet-link" onClick={go(l.id)} tabIndex={menuOpen ? 0 : -1}>
            {l.label}
          </a>
        ))}
        <button
          type="button"
          className="nav__sheet-link nav__sheet-theme"
          onClick={(e) => toggleTheme(e)}
          tabIndex={menuOpen ? 0 : -1}
        >
          {theme === "dark" ? "Mode clair" : "Mode sombre"}
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
