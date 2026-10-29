import { formatDAPlain, type Totals } from "./pricing";

/** Returns the number in local format (0551234567) or null if it isn't a valid Algerian number */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/[\s.\-()/]/g, "");
  if (digits.startsWith("+213")) digits = "0" + digits.slice(4);
  else if (digits.startsWith("00213")) digits = "0" + digits.slice(5);
  else if (digits.startsWith("213") && digits.length >= 11) digits = "0" + digits.slice(3);

  // Mobile: 05 / 06 / 07 + 8 digits. Landline: 02 / 03 / 04 / 09 + 7 digits.
  if (/^0[567]\d{8}$/.test(digits) || /^0[2349]\d{7}$/.test(digits)) return digits;
  return null;
}

/** 0551234567 -> 0551 23 45 67 */
export function prettyPhone(local: string): string {
  if (local.length === 10) return `${local.slice(0, 4)} ${local.slice(4, 6)} ${local.slice(6, 8)} ${local.slice(8)}`;
  return local;
}

type Contact = {
  name: string;
  phone: string;
  wilaya?: string;
  note?: string;
};

export function buildMessage(totals: Totals, contact: Contact): string {
  const lines: string[] = [];
  lines.push("Bonjour Nova Web Dz 👋");
  lines.push("Je souhaite un devis pour :");
  lines.push("");

  for (const s of totals.items) {
    lines.push(`• ${s.name} : ${s.from ? "à partir de " : ""}${formatDAPlain(s.price)}`);
  }
  if (totals.addonItems.length) {
    lines.push("");
    lines.push("Options :");
    for (const a of totals.addonItems) {
      lines.push(`+ ${a.name} : ${formatDAPlain(a.price)}${a.monthly ? " / mois" : ""}`);
    }
  }

  lines.push("");
  lines.push(`Total estimé : ${totals.hasFrom ? "à partir de " : ""}${formatDAPlain(totals.oneTime)}`);
  if (totals.monthly > 0) lines.push(`Puis ${formatDAPlain(totals.monthly)} / mois`);

  lines.push("");
  lines.push(`Nom : ${contact.name.trim()}`);
  lines.push(`Téléphone : ${prettyPhone(contact.phone)}`);
  if (contact.wilaya?.trim()) lines.push(`Wilaya : ${contact.wilaya.trim()}`);
  if (contact.note?.trim()) {
    lines.push("");
    lines.push(`Mon activité : ${contact.note.trim()}`);
  }

  return lines.join("\n");
}

export function whatsappLink(number: string, text?: string): string {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
