"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { computeTotals, type Totals } from "@/lib/pricing";
import type { CategoryId } from "@/config/site";

export type Filter = CategoryId | "all";

type SelectionContextValue = {
  selected: string[];
  addonIds: string[];
  totals: Totals;
  toggleService: (id: string) => void;
  removeService: (id: string) => void;
  toggleAddon: (id: string) => void;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const toggleService = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const removeService = useCallback((id: string) => {
    setSelected((prev) => prev.filter((x) => x !== id));
  }, []);

  const toggleAddon = useCallback((id: string) => {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const totals = useMemo(() => computeTotals(selected, addonIds), [selected, addonIds]);

  const value = useMemo(
    () => ({
      selected,
      addonIds,
      totals,
      toggleService,
      removeService,
      toggleAddon,
      sheetOpen,
      openSheet,
      closeSheet,
      filter,
      setFilter,
    }),
    [selected, addonIds, totals, toggleService, removeService, toggleAddon, sheetOpen, openSheet, closeSheet, filter],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used inside <SelectionProvider>");
  return ctx;
}
