/**
 * Everything you will want to edit lives in this file:
 * WhatsApp number, prices (in DA), services, options, demo sites and FAQ.
 */

export const site = {
  name: "Nova Web Dz",
  /** International format, digits only. Set NEXT_PUBLIC_WHATSAPP_NUMBER on Vercel, or replace the fallback. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "213XXXXXXXXX",
  instagramUrl: "https://www.instagram.com/nova_webdz",
  instagramHandle: "@nova_webdz",
};

export type CategoryId = "web" | "design" | "pfe";

export const categories: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "web", label: "Sites et systèmes" },
  { id: "design", label: "Design et montage" },
  { id: "pfe", label: "Rapports PFE" },
];

/** The three offers, as written on the Instagram bio. Shown in the hero; each one filters the picker. */
export const offers: { emoji: string; label: string; category: CategoryId }[] = [
  { emoji: "💻", label: "Sites web & systèmes sur mesure", category: "web" },
  { emoji: "🎨", label: "Logos · Présentations · Montage", category: "design" },
  { emoji: "🎓", label: "Rapports PFE & mise en page", category: "pfe" },
];

export type Service = {
  id: string;
  category: CategoryId;
  name: string;
  blurb: string;
  includes: string[];
  /** Price in DA */
  price: number;
  /** true = "à partir de" (starting price) */
  from?: boolean;
  delay: string;
  /** Tile width: "lg" = half a row, "md" = a third of a row */
  size: "lg" | "md";
};

export const services: Service[] = [
  // Sites web & systèmes sur mesure
  {
    id: "vitrine",
    category: "web",
    name: "Site vitrine",
    blurb: "Une page claire qui présente votre commerce et donne envie de vous appeler.",
    includes: ["Design sur mesure, pensé pour le téléphone", "Boutons WhatsApp et appel direct", "Localisation Google Maps"],
    price: 25000,
    delay: "5 à 7 jours",
    size: "lg",
  },
  {
    id: "multipages",
    category: "web",
    name: "Site multi-pages",
    blurb: "Accueil, services, galerie et contact, pour une entreprise qui veut inspirer confiance.",
    includes: ["Jusqu'à 6 pages", "Galerie photos", "Formulaire de contact"],
    price: 45000,
    delay: "10 à 15 jours",
    size: "lg",
  },
  {
    id: "boutique",
    category: "web",
    name: "Boutique en ligne",
    blurb: "Catalogue, panier et commandes avec paiement à la livraison, partout en Algérie.",
    includes: ["Catalogue et panier", "Commande avec paiement à la livraison", "Suivi des commandes"],
    price: 85000,
    from: true,
    delay: "3 à 4 semaines",
    size: "lg",
  },
  {
    id: "systeme",
    category: "web",
    name: "Système sur mesure",
    blurb: "Gestion de stock, réservations, espace clients ou élèves : un outil web fait pour votre activité.",
    includes: ["Comptes et connexion", "Espace administrateur", "Base de données"],
    price: 120000,
    from: true,
    delay: "Selon le projet",
    size: "lg",
  },
  // Logos · Présentations · Montage
  {
    id: "logo",
    category: "design",
    name: "Logo et identité",
    blurb: "Un logo, vos couleurs et vos polices, prêts pour l'enseigne et Instagram.",
    includes: ["3 propositions de logo", "Palette et typographies", "Fichiers pour l'impression"],
    price: 10000,
    delay: "3 à 5 jours",
    size: "md",
  },
  {
    id: "presentation",
    category: "design",
    name: "Présentation PowerPoint",
    blurb: "Des diapositives claires et à vos couleurs pour présenter un projet, une offre ou un cours.",
    includes: ["Jusqu'à 15 diapositives", "Design et animations", "Fichiers PowerPoint et PDF"],
    price: 4000,
    delay: "2 à 3 jours",
    size: "md",
  },
  {
    id: "montage",
    category: "design",
    name: "Montage vidéo",
    blurb: "Vos vidéos montées pour Reels, TikTok ou YouTube : coupes, textes et musique.",
    includes: ["Jusqu'à 1 minute", "Sous-titres et textes", "Format vertical ou horizontal"],
    price: 5000,
    delay: "2 à 3 jours",
    size: "md",
  },
  // Rapports PFE & mise en page
  {
    id: "rapport",
    category: "pfe",
    name: "Mise en page du rapport PFE",
    blurb: "Votre rapport mis aux normes de votre université, propre et cohérent du début à la fin.",
    includes: ["Page de garde et sommaire automatique", "Figures, tableaux et pages numérotés", "Bibliographie et version PDF"],
    price: 6000,
    delay: "3 à 5 jours",
    size: "lg",
  },
  {
    id: "soutenance",
    category: "pfe",
    name: "Présentation de soutenance",
    blurb: "Les diapositives de votre soutenance, construites à partir de votre rapport.",
    includes: ["15 à 25 diapositives", "Schémas et graphiques refaits proprement", "Fichiers PowerPoint et PDF"],
    price: 5000,
    delay: "3 à 4 jours",
    size: "lg",
  },
];

export type Addon = {
  id: string;
  name: string;
  price: number;
  monthly?: boolean;
};

/** Options shown only when a website or a system is selected */
export const addons: Addon[] = [
  { id: "domaine", name: "Nom de domaine et hébergement (1 an)", price: 6000 },
  { id: "langue", name: "Deuxième langue (arabe ou anglais)", price: 8000 },
  { id: "seo", name: "Référencement Google de base", price: 7000 },
  { id: "maintenance", name: "Maintenance et mises à jour", price: 3000, monthly: true },
];

export const navLinks = [
  { id: "services", label: "Services" },
  { id: "methode", label: "Comment ça marche" },
  { id: "exemples", label: "Exemples" },
  { id: "faq", label: "Questions" },
];

export const steps = [
  { title: "Vous choisissez", text: "Sélectionnez un ou plusieurs services. Le total s'affiche en dinars." },
  { title: "Vous laissez vos coordonnées", text: "Nom et numéro de téléphone : le formulaire prépare votre message WhatsApp." },
  { title: "On en parle sur WhatsApp", text: "On précise le contenu, les délais et le prix final avant de commencer." },
  { title: "Votre projet est livré", text: "Site mis en ligne ou fichiers remis. Paiement par BaridiMob, selon les étapes convenues." },
];

/** Live demo sites. Check the labels match each site. */
export const demos = [
  { name: "Dar Yemma", label: "Restaurant", url: "https://dar-yemma.vercel.app" },
  { name: "Cabinet Ibtissama", label: "Cabinet dentaire", url: "https://cabinet-ibtissama.vercel.app" },
  { name: "Nour Beauty", label: "Institut de beauté", url: "https://nourbeauty.vercel.app" },
  { name: "Atlas Iron", label: "Salle de sport", url: "https://atlas-iron.vercel.app" },
  { name: "Barber 16", label: "Barbier", url: "https://barber-16.vercel.app" },
  { name: "Cirta Motors", label: "Automobile", url: "https://cirta-motors.vercel.app" },
  { name: "Palais El Andalous", label: "Salle des fêtes", url: "https://palais-el-andalous.vercel.app" },
  { name: "Bayt Immobilier", label: "Agence immobilière", url: "https://bayt-immobilier.vercel.app" },
  { name: "Safa Voyages", label: "Agence de voyages", url: "https://safa-voyages.vercel.app" },
];

export const faq = [
  {
    q: "Les prix affichés sont-ils définitifs ?",
    a: "Ce sont des tarifs de départ. Le prix final dépend du contenu et des fonctionnalités ; il est confirmé avec vous sur WhatsApp avant le début du travail.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Le paiement se fait par BaridiMob. Les étapes de paiement sont fixées ensemble avant de commencer.",
  },
  {
    q: "Je n'ai pas de logo ni de photos. Est-ce un problème ?",
    a: "Non. Ajoutez le service Logo et identité, et on vous aide à préparer les textes et les photos de votre site.",
  },
  {
    q: "Pour un rapport PFE, qu'est-ce que je dois envoyer ?",
    a: "Votre rapport au format Word et le guide de mise en forme de votre université s'il existe. Vous recevez un fichier Word propre et un PDF prêt à imprimer.",
  },
  {
    q: "Mon site sera-t-il adapté au téléphone ?",
    a: "Oui. Chaque site est conçu d'abord pour le téléphone, puis adapté à l'ordinateur.",
  },
  {
    q: "Je ne sais pas quoi choisir.",
    a: "Écrivez-nous sur WhatsApp en décrivant votre activité, on vous conseille la formule adaptée.",
  },
];
