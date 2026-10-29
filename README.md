# Nova Web Dz

Order site for Nova Web Dz. Clients pick what they want (site, app, logo, video…), see the price in DA,
fill in their name and phone number, and WhatsApp opens with the full request already written.

Stack: Next.js 16 (App Router) + TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis smooth scroll.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Before you deploy

1. **WhatsApp number**: on Vercel, add an environment variable
   `NEXT_PUBLIC_WHATSAPP_NUMBER` = your number in international format, digits only
   (0551 23 45 67 becomes `213551234567`). Locally, copy `.env.example` to `.env.local`.
2. **Prices, services, options, FAQ, demo sites**: all in `src/config/site.ts`.
   Prices are in DA; set `from: true` on a service to show "à partir de".
   Check the category label of each demo site in `demos`.

Deploy as usual: push to GitHub, import the repo on Vercel.

## How it's built

| Part | File |
| --- | --- |
| Content and prices | `src/config/site.ts` |
| Liquid glass styles (all CSS) | `src/app/globals.css` |
| Refraction filters (Chromium) | `src/components/LiquidFilters.tsx` |
| Floating pill navbar + sliding droplet | `src/components/Navbar.tsx`, `src/lib/useLiquidBlob.ts` |
| Service picker, totals, options | `src/components/Services.tsx`, `src/components/Addons.tsx` |
| Form + WhatsApp message | `src/components/OrderSheet.tsx`, `src/lib/whatsapp.ts` |
| Lenis + GSAP ticker | `src/components/SmoothScroll.tsx` |

**Liquid glass**: any element with the `glass` class and an `<Fx />` (or `<span class="glass__fx">`) as its first child
becomes glass. Add `glass--edge` to bend the background at the rim, or `glass--lens` to magnify it.
In Chrome/Edge the background is truly refracted with an SVG displacement filter; Safari and Firefox show frosted glass
with the same rim lights.

Tip: don't fade glass elements with `opacity` in animations. While opacity is below 1 the blur behind them switches
off. Animate scale or position instead (that's what the menu, the sheet and the drops do).
