import { addons, services, type Addon, type Service } from "@/config/site";

export function formatDA(n: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} DA`;
}

/** Same as formatDA but with plain spaces, safe for a WhatsApp message */
export function formatDAPlain(n: number): string {
  return formatDA(n).replace(/[  ]/g, " ");
}

export type Totals = {
  items: Service[];
  addonItems: Addon[];
  addonsAvailable: boolean;
  oneTime: number;
  monthly: number;
  hasFrom: boolean;
};

export function computeTotals(selectedIds: string[], addonIds: string[]): Totals {
  const items = services.filter((s) => selectedIds.includes(s.id));
  const addonsAvailable = items.some((s) => s.category === "web");
  const addonItems = addonsAvailable ? addons.filter((a) => addonIds.includes(a.id)) : [];

  const oneTime =
    items.reduce((sum, s) => sum + s.price, 0) +
    addonItems.filter((a) => !a.monthly).reduce((sum, a) => sum + a.price, 0);
  const monthly = addonItems.filter((a) => a.monthly).reduce((sum, a) => sum + a.price, 0);

  return {
    items,
    addonItems,
    addonsAvailable,
    oneTime,
    monthly,
    hasFrom: items.some((s) => s.from),
  };
}
