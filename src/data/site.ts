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
    title: "Développeur web freelance à Blois · Hugo Feuilloy",
    description:
      "Création de sites web à Blois et partout en France : sites vitrines, boutiques en ligne et outils sur mesure. Développeur web freelance.",
  },
  address: { locality: "Contres", postalCode: "41700", region: "Centre-Val de Loire", country: "FR" },
  areaServed: [
    { type: "City", name: "Blois" },
    { type: "City", name: "Tours" },
    { type: "City", name: "Orléans" },
    { type: "AdministrativeArea", name: "Loir-et-Cher" },
    { type: "Country", name: "France" },
  ],
  school: "IUT de Blois",
  // URLs des profils publics, à compléter. Une valeur vide est ignorée.
  social: { linkedin: "", instagram: "", malt: "" },
  links: {
    legal: "/mentions-legales",
    privacy: "/confidentialite",
  },
};

export const routes = [
  { path: "/", title: site.seo.title, description: site.seo.description, indexable: true },
  {
    path: site.links.legal,
    indexable: false,
    title: "Mentions légales · Hugo Feuilloy",
    description: "Mentions légales du site de Hugo Feuilloy, développeur web freelance basé près de Blois.",
  },
  {
    path: site.links.privacy,
    indexable: false,
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

export const mobileMenuCta = { label: "Demander un devis", href: "#contact", text: "Un projet en tête ? Réponse sous 24 h." };

export const primaryCta = { label: "Démarrer mon projet", href: "#formulaire" };

export const hero = {
  heading: "Développeur web freelance à Blois",
  lead: "Des sites qui",
  words: ["vendent", "rassurent", "durent", "marquent", "travaillent"],
  intervalMs: 2800,
  // Le début de phrase est masqué en mobile, la suite prend alors une majuscule.
  textLead: "Commerces, indépendants, associations ou PME : ",
  text: "sites vitrines, boutiques en ligne et outils sur mesure, finis jusqu’au dernier pixel.",
  secondary: { label: "Voir les réalisations", href: "#realisations" },
  proof: [
    { text: "Basé près de Blois", desktopSuffix: ", partout en France" },
    { text: "Partout en France", only: "mobile" },
    { text: "Un seul interlocuteur", only: "desktop" },
    { text: "Réponse sous 24 h" },
    { text: `Suivi ${maintenance.priceLabel}` },
  ] as { text: string; desktopSuffix?: string; only?: "mobile" | "desktop" }[],
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

export const approach = {
  id: "facon-de-travailler",
  label: "Ma façon de travailler",
  title: "Je travaille avec l’IA. Et je l’assume",
  text: "Elle m’aide à aller plus vite sur ce qui est répétitif, pour passer plus de temps sur ce qui compte : comprendre votre métier, soigner le design, tester chaque détail.",
  points: [
    { label: "Plus rapide", text: "Des délais plus courts, sans rogner sur la qualité." },
    { label: "Plus juste", text: "Vous payez la réflexion et le résultat, pas des heures de saisie." },
    { label: "Toujours maîtrisé", text: "Chaque ligne est relue, comprise et testée. L’IA propose, je décide." },
  ],
  faq: {
    question: "Utilisez-vous l’intelligence artificielle ?",
    answer:
      "Oui, comme outil de travail, au même titre qu’un éditeur de code. Elle me fait gagner du temps sur les tâches techniques répétitives. La conception, les choix et la relecture restent faits par moi, et le site livré vous appartient entièrement.",
  },
};

export const about = {
  title: "Moi, c’est Hugo",
  role: "Développeur web freelance · formé à l’IUT de Blois",
  // Le début de phrase est masqué en mobile, où le rôle est affiché juste au-dessus.
  textLead: "Développeur web formé à l’IUT de Blois. ",
  text: "Je conçois chaque site comme un produit : une idée claire, une exécution précise, et aucun détail laissé au hasard.",
  traits: [
    { title: "24 h", text: "pour répondre" },
    { title: "1", text: "interlocuteur" },
    { title: "Visio", text: "ou près de Blois" },
  ],
};

export const contactSection = {
  titleLines: ["Parlons de", "votre projet"],
  // Le début de phrase est masqué en mobile, la suite prend alors une majuscule.
  textLead: "Racontez-moi votre projet, ",
  text: "même s’il n’est pas encore totalement défini. Réponse sous 24 h, sans jargon et sans engagement.",
  needsLegend: "De quoi avez-vous besoin ?",
  needsLegendShort: "Votre projet",
  needs: [
    { label: "Site vitrine", short: "Site vitrine" },
    { label: "Boutique en ligne", short: "Boutique" },
    { label: "Réservation", short: "Réservation" },
    { label: "Espace client", short: "Espace client" },
    { label: "Outil sur mesure", short: "Sur mesure" },
    { label: "Maintenance", short: "Maintenance" },
  ],
  placeholders: { nom: "Jean Dupont", email: "vous@exemple.fr", message: "Votre activité, ce que vous imaginez…" },
  detailsToggle: "Ajouter des détails (facultatif)",
  mobileNote: "Réponse sous 24 h",
  budgets: ["Moins de 2 000 €", "2 000 à 5 000 €", "Plus de 5 000 €"],
  endpoint: "/api/contact.php",
  success: { title: "Message envoyé", text: "Merci, je vous réponds sous 24 h à l’adresse indiquée." },
  error: "L’envoi n’a pas abouti. Réessayez, ou écrivez-moi directement à",
};
