"use client";

import { addons } from "@/config/site";
import { formatDA } from "@/lib/pricing";
import { useSelection } from "./SelectionProvider";

export default function Addons({ className = "" }: { className?: string }) {
  const { addonIds, toggleAddon, totals } = useSelection();
  if (!totals.addonsAvailable) return null;

  return (
    <fieldset className={`addons ${className}`}>
      <legend className="addons__title">Options</legend>
      {addons.map((a) => {
        const on = addonIds.includes(a.id);
        return (
          <label key={a.id} className="addons__row">
            <span className="addons__text">
              <span>{a.name}</span>
              <small>
                + {formatDA(a.price)}
                {a.monthly ? " / mois" : ""}
              </small>
            </span>
            <input type="checkbox" role="switch" className="switch" checked={on} onChange={() => toggleAddon(a.id)} />
          </label>
        );
      })}
    </fieldset>
  );
}
