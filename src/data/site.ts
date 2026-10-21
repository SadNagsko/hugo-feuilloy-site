import { maintenance } from "./offers.ts";

export const site = {
  name: "Hugo Feuilloy",
  url: "https://hugofeuilloy.fr",
  legalName: "Hugo Feuilloy EI",
  initials: "HF",
  email: "hugofeuilloy41@gmail.com",
  phone: "07 71 64 32 45",
  area: "Blois, France",
  portrait: "/hugo.webp",
  seo: {
    title: "Hugo Feuilloy · Développeur web freelance – Blois et toute la France",
    description:
      "Développeur web freelance basé près de Blois. Sites vitrines, boutiques en ligne et outils sur mesure pour les entreprises de toute la France.",
  },
  links: {
    legal: "/mentions-legales",
    privacy: "/confidentialite",
  },
};

export const routes = [
  { path: "/", title: site.seo.title, description: site.seo.description },
  {
    path: site.links.legal,
    title: "Mentions légales · Hugo Feuilloy",
    description: "Mentions légales du site de Hugo Feuilloy, développeur web freelance basé près de Blois.",
  },
  {
    path: site.links.privacy,
    title: "Politique de confidentialité · Hugo Feuilloy",
    description: "Quelles données sont collectées sur le site de Hugo Feuilloy, pourquoi, combien de temps, et comment exercer vos droits.",
  },
] as const;

export type RoutePath = (typeof routes)[number]["path"];

export function resolveRoute(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return routes.find((route) => route.path === normalized) ?? routes[0];
}

export const hasPhone = !site.phone.startsWith("TODO");
export const phoneHref = `tel:${site.phone.replace(/[^\d+]/g, "").replace(/^0/, "+33")}`;

export const nav = [
  { label: "Réalisations", href: "#realisations" },
  { label: "Offres", href: "#offres" },
  { label: "À propos", href: "#a-propos" },
  { label: "Contact", href: "#contact" },
];

export const mobileMenuCta = { label: "Demander un devis", href: "#contact" };

export const primaryCta = { label: "Démarrer mon projet", href: "#formulaire" };

export const hero = {
  eyebrow: "Développeur web freelance · Partout en France",
  lead: "Des sites qui",
  words: ["vendent", "rassurent", "durent", "marquent", "travaillent"],
  intervalMs: 2800,
  text: "Commerces, indépendants, associations ou PME : sites vitrines, boutiques en ligne et outils sur mesure, finis jusqu’au dernier pixel.",
  textShort: "Sites vitrines, boutiques en ligne et outils sur mesure, finis jusqu’au dernier pixel.",
  secondary: { label: "Voir les réalisations", href: "#realisations" },
  proofShort: ["Basé près de Blois", "Partout en France", "Réponse sous 24 h", `Suivi ${maintenance.priceLabel}`],
  proof: ["Basé près de Blois, partout en France", "Un seul interlocuteur", "Réponse sous 24 h", `Suivi ${maintenance.priceLabel}`],
};

export const statement = {
  sentences: [
    { text: "Un seul interlocuteur", dot: true },
    { text: "Du premier café à la mise en ligne," },
    { text: "puis chaque mois après." },
    { text: "Pas d’agence, pas d’intermédiaire, pas de surprise." },
  ],
  steps: [
    { label: "01 · Concevoir", text: "Une maquette avant la moindre ligne de code." },
    { label: "02 · Développer", text: "Rapide, sécurisé, parfait sur mobile." },
    { label: "03 · Suivre", text: "Hébergement, mises à jour et modifications." },
  ],
};

export const about = {
  title: "Moi, c’est Hugo",
  text: "Développeur web formé à l’IUT de Blois. Je conçois chaque site comme un produit : une idée claire, une exécution précise, et aucun détail laissé au hasard.",
  traits: [
    { title: "Proche ou à distance", text: "Près de Blois ou en visio" },
    { title: "Réactif", text: "Réponse sous 24 h" },
    { title: "Exigeant", text: "Rien au hasard" },
  ],
};

export const contactSection = {
  titleLines: ["Parlons de", "votre projet"],
  text: "Racontez-moi votre projet, même s’il n’est pas encore totalement défini. Réponse sous 24 h, sans jargon et sans engagement.",
  needs: ["Site vitrine", "Boutique en ligne", "Réservation", "Espace client", "Outil sur mesure", "Maintenance"],
  budgets: ["Moins de 2 000 €", "2 000 à 5 000 €", "Plus de 5 000 €"],
  endpoint: "/api/contact.php",
  success: { title: "Message envoyé", text: "Merci, je vous réponds sous 24 h à l’adresse indiquée." },
  error: "L’envoi n’a pas abouti. Réessayez, ou écrivez-moi directement à",
};
