export type Offer = {
  name: string;
  price: string;
  from: boolean;
  text: string;
  points: string[];
  badge?: string;
  /** Page service détaillée, liée depuis la carte de l'accueil. */
  page?: string;
};

export const offersIntro = {
  title: "Une offre claire",
  text: "Un prix de départ affiché, un devis détaillé après un premier échange.",
};

export const offers: Offer[] = [
  {
    name: "Vitrine",
    price: "990 €",
    from: true,
    text: "Pour être trouvé sur Google et contacté facilement.",
    points: ["Jusqu’à 5 pages, maquette incluse", "Responsive et rapide", "Référencement local de base", "Fiche Google Business"],
    page: "/creation-site-vitrine",
  },
  {
    name: "Boutique en ligne",
    price: "3 990 €",
    from: true,
    text: "Pour vendre en ligne, avec retrait sur place ou livraison.",
    points: ["Catalogue et paiement sécurisé", "Gestion des commandes", "Click and collect", "Formation à la prise en main"],
    badge: "Le plus demandé",
    page: "/creation-boutique-en-ligne",
  },
  {
    name: "Sur mesure",
    price: "Sur devis",
    from: false,
    text: "Espace client, réservation, outil métier : construit autour de votre façon de travailler.",
    points: ["Atelier de cadrage", "Prototype interactif", "Développement par étapes", "Évolutions dans le temps"],
  },
];

export type PlanId = "essentiel" | "pro" | "serenite";

export type MaintenancePlan = {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  badge?: string;
};

export type MaintenanceFeature = {
  label: string;
  values: Record<PlanId, boolean | string>;
};

export const maintenancePlans: MaintenancePlan[] = [
  { id: "essentiel", name: "Essentiel", monthlyPrice: 29 },
  { id: "pro", name: "Pro", monthlyPrice: 59, badge: "Recommandé" },
  { id: "serenite", name: "Sérénité", monthlyPrice: 119 },
];

export const maintenanceFeatures: MaintenanceFeature[] = [
  { label: "Hébergement + certificat SSL", values: { essentiel: true, pro: true, serenite: true } },
  { label: "Gestion du nom de domaine", values: { essentiel: true, pro: true, serenite: true } },
  { label: "Sauvegardes", values: { essentiel: true, pro: true, serenite: true } },
  { label: "Mises à jour de sécurité", values: { essentiel: false, pro: true, serenite: true } },
  { label: "Surveillance et alertes", values: { essentiel: false, pro: true, serenite: true } },
  { label: "Modifications incluses", values: { essentiel: false, pro: "30 min / mois", serenite: "2 h / mois" } },
  { label: "Rapport mensuel", values: { essentiel: false, pro: false, serenite: true } },
  { label: "Réponse prioritaire", values: { essentiel: false, pro: false, serenite: true } },
];

export const maintenanceFrom = Math.min(...maintenancePlans.map((plan) => plan.monthlyPrice));

export const monitoring = {
  title: "Vos sites, surveillés par Nova",
  text: "Nova, c’est l’assistante que j’ai développée pour mon activité. Elle contrôle en continu la disponibilité, la sécurité et les mises à jour de vos sites, et prépare votre rapport mensuel. Je vérifie tout avant envoi.",
};

export const maintenance = {
  text: "Hébergement, sécurité et modifications",
  priceLabel: `dès ${maintenanceFrom} €/mois`,
  toggleLabel: "Comparer les formules",
  page: "/maintenance-site-web",
  pageLabel: "Tout sur la maintenance",
  perMonth: "/mois",
  note: "Sans engagement, résiliable à tout moment. Jusqu’à trois mois de maintenance offerts sur les gros projets.",
};
