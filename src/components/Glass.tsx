/**
 * Liquid glass building block.
 *
 * Any element with the `glass` class becomes a glass surface:
 *  - `.glass__fx`  (this span)  blurs + saturates what's behind, and in Chromium
 *                               bends it with an SVG displacement filter (refraction)
 *  - `::before`                 tint and top gloss
 *  - `::after`                  specular rim light
 *
 * Put <Fx /> as the first child of any element that has the `glass` class.
 * Add `glass--edge` (edge refraction) or `glass--lens` (magnifying lens) to refract.
 */
export function Fx() {
  return <span className="glass__fx" aria-hidden="true" />;
}
