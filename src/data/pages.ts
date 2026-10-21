import { maintenance, maintenanceFeatures, maintenancePlans, offers, type Offer, type PlanId } from "./offers.ts";

// Pages de contenu (services, page locale, étude de cas, article), pré-rendues comme l'accueil.
// Liens internes dans le texte : [libellé](/chemin). Toute info manquante est marquée TODO_HUGO.

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "points"; items: { title: string; text: string }[] }
  | { type: "steps"; withStatement: true; extra: { label: string; text: string }[] }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "todo"; text: string }
  | { type: "offer"; offer: Offer }
  | { type: "plans" }
  | { type: "shots"; slug: string; name: string };

export type Section = { title: string; blocks: Block[] };
export type PageLink = { label: string; href: string; text: string };

type BasePage = {
  path: string;
  /** Balise <title> : requête en premier, ≤ 60 caractères. */
  title: string;
  /** Meta description, ≤ 155 caractères. */
  description: string;
  h1: string;
  breadcrumb: string;
  intro: string;
  sections: Section[];
  related: PageLink[];
  cta: { title: string; text: string };
};

export type ServicePageData = BasePage & { kind: "service"; service: { name: string; type: string; offers: Offer[] | "maintenance" } };
export type CityPageData = BasePage & { kind: "city" };
export type CaseStudyPageData = BasePage & { kind: "case"; client: string; siteUrl: string; siteLabel: string };
export type ArticlePageData = BasePage & { kind: "article"; published: string; publishedLabel: string };
export type ContentPage = ServicePageData | CityPageData | CaseStudyPageData | ArticlePageData;

export const paths = {
  vitrine: "/creation-site-vitrine",
  boutique: "/creation-boutique-en-ligne",
  maintenance: "/maintenance-site-web",
  blois: "/developpeur-web-blois",
  caseStudy: "/realisations/les-belles-demois-ailes",
  priceArticle: "/blog/prix-site-vitrine",
} as const;

const offerByName = (name: string) => {
  const offer = offers.find((item) => item.name === name);
  if (!offer) throw new Error(`Offre introuvable : ${name}`);
  return offer;
};
const vitrine = offerByName("Vitrine");
const boutique = offerByName("Boutique en ligne");
const surMesure = offerByName("Sur mesure");
const priceOf = (offer: Offer) => `${offer.from ? "dès " : ""}${offer.price}`;

const plan = (id: PlanId) => {
  const found = maintenancePlans.find((item) => item.id === id);
  if (!found) throw new Error(`Formule introuvable : ${id}`);
  return found;
};
const included = (label: string, id: PlanId) => maintenanceFeatures.find((feature) => feature.label === label)?.values[id];
const essentiel = plan("essentiel");
const pro = plan("pro");
const serenite = plan("serenite");
const monthly = (id: PlanId) => `${plan(id).monthlyPrice} €${maintenance.perMonth}`;

export const ctaLabel = "Démarrer mon projet";
export const ctaHref = "/#contact";

const serviceLinks: Record<"vitrine" | "boutique" | "maintenance" | "blois", PageLink> = {
  vitrine: { label: "Création de site vitrine", href: paths.vitrine, text: `Être trouvé sur Google et contacté facilement, ${priceOf(vitrine)}.` },
  boutique: { label: "Création de boutique en ligne", href: paths.boutique, text: `Vendre vos produits en retrait sur place ou en livraison, ${priceOf(boutique)}.` },
  maintenance: { label: "Maintenance et hébergement", href: paths.maintenance, text: `Un site toujours en ligne, à jour et surveillé, ${maintenance.priceLabel}.` },
  blois: { label: "Développeur web à Blois", href: paths.blois, text: "Rendez-vous à Blois ou en visio, avec un interlocuteur du Loir-et-Cher." },
};

const vitrinePage: ServicePageData = {
  kind: "service",
  path: paths.vitrine,
  title: "Création de site vitrine sur mesure · Hugo Feuilloy",
  description: `Création de site vitrine sur mesure pour commerces, artisans, indépendants et associations : jusqu’à 5 pages, maquette incluse, ${priceOf(vitrine)}.`,
  h1: "Création de site vitrine sur mesure",
  breadcrumb: "Création de site vitrine",
  intro: `Un site vitrine présente votre activité, rassure vos futurs clients et leur donne envie de vous contacter. Je le conçois pour vous, de la maquette à la mise en ligne, avec un prix de départ affiché : ${priceOf(vitrine)}.`,
  service: { name: "Création de site vitrine", type: "Création de site internet", offers: [vitrine] },
  sections: [
    {
      title: "À qui s’adresse un site vitrine ?",
      blocks: [
        { type: "p", text: "À toutes les structures qui ont besoin d’être trouvées et contactées, sans forcément vendre en ligne :" },
        {
          type: "list",
          items: [
            "les commerces de proximité, pour afficher leurs horaires, leurs produits et leur accès ;",
            "les artisans, pour montrer leurs réalisations et recevoir des demandes de devis ;",
            "les indépendants et professions libérales, pour présenter leurs services et inspirer confiance ;",
            "les associations, pour expliquer leur action, annoncer leurs événements et trouver des bénévoles.",
          ],
        },
        { type: "p", text: `Si vous voulez vendre vos produits directement sur le site, une [boutique en ligne](${paths.boutique}) sera plus adaptée.` },
      ],
    },
    {
      title: "Qu’est-ce qui est inclus ?",
      blocks: [
        { type: "offer", offer: vitrine },
        {
          type: "p",
          text: "La maquette vient en premier : vous voyez à quoi ressemblera votre site avant que je commence à le développer, et c’est le bon moment pour demander des ajustements.",
        },
        {
          type: "p",
          text: "Vos visiteurs vous consultent aussi bien depuis un téléphone que depuis un ordinateur : le site est pensé pour les deux, et il se charge vite.",
        },
        {
          type: "p",
          text: "Le référencement local de base et la fiche Google Business vous aident à apparaître quand quelqu’un cherche votre activité près de chez lui.",
        },
        { type: "todo", text: "TODO_HUGO : préciser ce que comprend le « référencement local de base »." },
      ],
    },
    {
      title: "Comment se passe la création ?",
      blocks: [
        {
          type: "p",
          text: "Tout commence par un échange : vous me décrivez votre activité et ce que vous attendez du site. Je vous réponds sous 24 h, puis je vous envoie un devis détaillé. Ensuite, le projet avance en quatre étapes, avec un seul interlocuteur du début à la fin :",
        },
        {
          type: "steps",
          withStatement: true,
          extra: [{ label: "04 · Mettre en ligne", text: "Le site est publié sur votre nom de domaine et vérifié sur ordinateur comme sur mobile." }],
        },
        { type: "todo", text: "TODO_HUGO : indiquer le délai habituel entre la validation du devis et la mise en ligne d’un site vitrine." },
      ],
    },
    {
      title: "Combien coûte un site vitrine ?",
      blocks: [
        {
          type: "p",
          text: `L’offre Vitrine démarre à ${vitrine.price}. Ce prix correspond à un site jusqu’à 5 pages, avec la maquette, l’adaptation mobile, le référencement local de base et la fiche Google Business. Le devis varie ensuite selon votre projet :`,
        },
        {
          type: "list",
          items: [
            "le nombre de pages au-delà de cinq ;",
            "la rédaction des textes, si vous ne les fournissez pas ;",
            "les photos : celles que vous avez déjà, ou des visuels à prévoir ;",
            "les fonctionnalités particulières, comme une prise de rendez-vous ou un site en plusieurs langues.",
          ],
        },
        {
          type: "p",
          text: `Après la mise en ligne, l’hébergement et le suivi passent par une formule de [maintenance](${paths.maintenance}), ${maintenance.priceLabel}. Pour aller plus loin, j’ai détaillé [ce qui fait varier le prix d’un site vitrine](${paths.priceArticle}).`,
        },
        { type: "todo", text: "TODO_HUGO : conditions de paiement (acompte, échéancier)." },
      ],
    },
    {
      title: "Questions fréquentes",
      blocks: [
        {
          type: "faq",
          items: [
            {
              question: "Je n’ai pas encore de textes ni de photos, est-ce un problème ?",
              answer: "Non. Dites-le dès le premier échange : on regarde ensemble ce que vous pouvez fournir et ce qu’il faut prévoir en plus dans le devis.",
            },
            { question: "Pourrai-je modifier le site moi-même ?", answer: "TODO_HUGO : expliquer si le client peut modifier ses textes lui-même, et avec quel outil." },
            { question: "Le site m’appartient-il ?", answer: "Oui. Une fois livré, le site vous appartient entièrement." },
            {
              question: "Travaillez-vous seulement autour de Blois ?",
              answer: "Non. Je suis basé près de Blois et je travaille avec des clients partout en France, en visio quand la distance l’impose.",
            },
          ],
        },
      ],
    },
  ],
  related: [serviceLinks.boutique, serviceLinks.maintenance, serviceLinks.blois],
  cta: { title: "Un projet de site vitrine ?", text: "Décrivez-le en quelques lignes, même s’il n’est pas encore défini. Réponse sous 24 h." },
};

const boutiquePage: ServicePageData = {
  kind: "service",
  path: paths.boutique,
  title: "Création de boutique en ligne · Hugo Feuilloy",
  description: `Création de boutique en ligne pour les commerces : paiement sécurisé, gestion des commandes, click and collect et formation incluse, ${priceOf(boutique)}.`,
  h1: "Création de boutique en ligne pour les commerces",
  breadcrumb: "Création de boutique en ligne",
  intro: `Vendre vos produits en ligne, en retrait sur place ou en livraison, sans passer par une place de marché. Je conçois et développe votre boutique, puis je vous forme à la gérer au quotidien. L’offre Boutique en ligne démarre à ${boutique.price}.`,
  service: { name: "Création de boutique en ligne", type: "Création de site e-commerce", offers: [boutique] },
  sections: [
    {
      title: "Pour quels commerces ?",
      blocks: [
        {
          type: "p",
          text: "Pour les commerces et les producteurs qui veulent vendre directement à leurs clients : une épicerie fine, une boutique de créateur, un producteur local, un artisan qui vend ses pièces.",
        },
        {
          type: "p",
          text: "La boutique complète votre point de vente plutôt qu’elle ne le remplace : vos clients habituels commandent quand ça les arrange, et d’autres vous découvrent en ligne.",
        },
        {
          type: "p",
          text: `C’est le choix qu’a fait [Les Belles Demois’Ailes](${paths.caseStudy}), une miellerie artisanale de Contres qui vend désormais sa production en direct, sans intermédiaire.`,
        },
      ],
    },
    {
      title: "Ce qui est inclus",
      blocks: [
        { type: "offer", offer: boutique },
        {
          type: "p",
          text: "Le catalogue présente vos produits avec leurs photos, leurs prix et leur description. Vos clients paient en ligne, de façon sécurisée, sans quitter votre site.",
        },
        { type: "todo", text: "TODO_HUGO : préciser la solution de paiement utilisée et les moyens de paiement acceptés." },
        { type: "p", text: "Les commandes arrivent dans un espace de gestion, où vous les suivez jusqu’au retrait ou à l’expédition." },
      ],
    },
    {
      title: "Retrait sur place ou livraison",
      blocks: [
        {
          type: "p",
          text: "Le click and collect est inclus : votre client commande et paie en ligne, puis vient chercher sa commande chez vous. Pour une clientèle proche, c’est souvent la façon la plus simple de démarrer.",
        },
        { type: "p", text: "Si vous expédiez vos produits, la livraison est prévue dans la boutique, avec les options qui correspondent à votre activité." },
        { type: "todo", text: "TODO_HUGO : indiquer comment sont gérés les frais de port et les transporteurs." },
      ],
    },
    {
      title: "Une formation pour être autonome",
      blocks: [
        {
          type: "p",
          text: "Une boutique vit tous les jours. La formation à la prise en main est incluse : vous apprenez à ajouter un produit, modifier un prix et traiter une commande, pour ne pas dépendre de moi pour le quotidien.",
        },
        { type: "todo", text: "TODO_HUGO : format de la formation (durée, sur place ou en visio, support fourni)." },
      ],
    },
    {
      title: "Comment se passe le projet ?",
      blocks: [
        {
          type: "p",
          text: "Comme pour tous mes projets : une maquette d’abord, puis le développement, puis le suivi. Pour une boutique, la maquette sert surtout à valider le parcours d’achat, de la fiche produit jusqu’au paiement, sans étape inutile.",
        },
        { type: "p", text: "Avant l’ouverture, je passe des commandes de test pour vérifier chaque étape, du panier à la confirmation." },
        { type: "todo", text: "TODO_HUGO : délai habituel de création d’une boutique en ligne." },
      ],
    },
    {
      title: "Le prix d’une boutique en ligne",
      blocks: [
        {
          type: "p",
          text: `L’offre démarre à ${boutique.price}. Le devis dépend surtout du nombre de produits à mettre en ligne, des options de livraison et des fonctionnalités particulières, comme des produits personnalisables ou plusieurs points de retrait.`,
        },
        {
          type: "p",
          text: `Une fois la boutique ouverte, l’hébergement, la sécurité et les mises à jour passent par une formule de [maintenance](${paths.maintenance}), ${maintenance.priceLabel}. Pour une boutique qui encaisse des paiements, les mises à jour de sécurité comptent particulièrement : elles sont incluses à partir de la formule ${pro.name}.`,
        },
      ],
    },
    {
      title: "Questions fréquentes",
      blocks: [
        {
          type: "faq",
          items: [
            {
              question: "Pourrai-je ajouter mes produits moi-même ?",
              answer: "Oui, c’est tout l’objet de la formation incluse. Si vous avez beaucoup de produits à mettre en ligne au départ, parlons-en au moment du devis.",
            },
            { question: "J’ai déjà un site vitrine, faut-il tout refaire ?", answer: "TODO_HUGO : expliquer si une boutique peut s’ajouter à un site existant." },
            {
              question: "Et si j’ai besoin d’un outil plus spécifique ?",
              answer: `Réservation, espace client, outil métier : c’est le rôle de l’offre ${surMesure.name}, ${surMesure.price.toLowerCase()}. Décrivez votre besoin dans le formulaire de contact.`,
            },
          ],
        },
      ],
    },
  ],
  related: [serviceLinks.vitrine, serviceLinks.maintenance, serviceLinks.blois],
  cta: { title: "Envie de vendre en ligne ?", text: "Dites-moi ce que vous vendez et comment vous livrez aujourd’hui. Réponse sous 24 h." },
};

const maintenancePage: ServicePageData = {
  kind: "service",
  path: paths.maintenance,
  title: "Maintenance et hébergement de site web · Hugo Feuilloy",
  description: `Maintenance et hébergement de site web : sauvegardes, mises à jour de sécurité, surveillance et modifications. 3 formules sans engagement, ${maintenance.priceLabel}.`,
  h1: "Maintenance et hébergement de site web",
  breadcrumb: "Maintenance et hébergement",
  intro: `Un site en ligne a besoin d’un hébergement, de mises à jour et d’une surveillance. Je m’en occupe avec trois formules sans engagement, ${maintenance.priceLabel}.`,
  service: { name: "Maintenance et hébergement de site web", type: "Maintenance de site internet", offers: "maintenance" },
  sections: [
    {
      title: "Pourquoi entretenir son site ?",
      blocks: [
        {
          type: "p",
          text: "Un site n’est pas terminé le jour de sa mise en ligne. Les logiciels sur lesquels il repose évoluent, des failles de sécurité sont découvertes, un certificat doit être renouvelé, un horaire doit être changé. Sans suivi, ces petites choses s’accumulent, jusqu’au jour où le site ne s’affiche plus.",
        },
        { type: "p", text: "La maintenance règle ce problème en amont : quelqu’un garde un œil sur votre site et s’en occupe, pour que vous n’ayez pas à y penser." },
      ],
    },
    {
      title: "Les trois formules",
      blocks: [
        {
          type: "p",
          text: "Toutes les formules comprennent l’hébergement avec certificat SSL, la gestion du nom de domaine et les sauvegardes. Elles se distinguent par le niveau de surveillance et le temps de modification inclus :",
        },
        {
          type: "points",
          items: [
            { title: `${essentiel.name}, ${monthly("essentiel")}`, text: "Ce qu’il faut pour que le site reste en ligne et sauvegardé." },
            {
              title: `${pro.name}, ${monthly("pro")}`,
              text: `En plus : les mises à jour de sécurité, la surveillance avec alertes et ${included("Modifications incluses", "pro")} de modifications.`,
            },
            {
              title: `${serenite.name}, ${monthly("serenite")}`,
              text: `En plus : ${included("Modifications incluses", "serenite")} de modifications, un rapport mensuel et une réponse prioritaire.`,
            },
          ],
        },
        { type: "plans" },
      ],
    },
    {
      title: "Ce que surveille Nova",
      blocks: [
        {
          type: "p",
          text: `Nova est l’assistante que j’ai développée pour mon activité. Elle contrôle en continu la disponibilité de votre site, sa sécurité et l’état de ses mises à jour. La surveillance avec alertes est incluse à partir de la formule ${pro.name}.`,
        },
        { type: "p", text: "Nova prépare, je décide : chaque alerte et chaque rapport passe par moi avant d’arriver chez vous." },
        { type: "todo", text: "TODO_HUGO : préciser la fréquence des contrôles de Nova." },
      ],
    },
    {
      title: "Le rapport mensuel",
      blocks: [
        {
          type: "p",
          text: `Avec la formule ${serenite.name}, vous recevez chaque mois un rapport sur votre site. Nova le prépare à partir de ce qu’elle a observé pendant le mois, et je le relis avant de vous l’envoyer.`,
        },
        { type: "todo", text: "TODO_HUGO : détailler le contenu du rapport mensuel (disponibilité, mises à jour faites, modifications réalisées…)." },
      ],
    },
    {
      title: "Et en cas de panne ?",
      blocks: [
        {
          type: "p",
          text: `Si votre site ne répond plus, l’alerte m’arrive directement avec les formules ${pro.name} et ${serenite.name}, et j’interviens pour le remettre en ligne. Les sauvegardes, présentes dans toutes les formules, permettent de revenir à une version saine si nécessaire.`,
        },
        { type: "todo", text: "TODO_HUGO : délai d’intervention en cas de panne, par formule." },
        { type: "todo", text: "TODO_HUGO : fréquence des sauvegardes et durée de conservation." },
      ],
    },
    {
      title: "Les modifications incluses",
      blocks: [
        {
          type: "p",
          text: `Un horaire à changer, une photo à remplacer, un paragraphe à mettre à jour : la formule ${pro.name} inclut ${included("Modifications incluses", "pro")} de modifications, la formule ${serenite.name} ${included("Modifications incluses", "serenite")}. Vous m’envoyez votre demande, je m’en occupe.`,
        },
        { type: "todo", text: "TODO_HUGO : ce qui se passe pour le temps non utilisé, et le tarif au-delà du temps inclus." },
      ],
    },
    {
      title: "Résiliation",
      blocks: [
        { type: "p", text: `${maintenance.note} Vous restez libre de changer de formule ou d’arrêter quand vous le souhaitez.` },
        { type: "todo", text: "TODO_HUGO : préavis éventuel, et ce que vous récupérez en partant (fichiers du site, transfert du nom de domaine)." },
      ],
    },
    {
      title: "Questions fréquentes",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "Mon site n’a pas été créé par vous. Pouvez-vous le maintenir ?", answer: "TODO_HUGO : préciser si vous reprenez des sites existants, et à quelles conditions." },
            {
              question: "Quelle formule choisir ?",
              answer: `Si votre site change rarement, ${essentiel.name} suffit. Si vous encaissez des paiements ou voulez être alerté au moindre problème, partez sur ${pro.name}. ${serenite.name} convient si vous modifiez souvent votre site et voulez un suivi mensuel.`,
            },
          ],
        },
      ],
    },
  ],
  related: [serviceLinks.vitrine, serviceLinks.boutique, serviceLinks.blois],
  cta: { title: "Un site à faire suivre ?", text: "Indiquez l’adresse de votre site et la formule qui vous intéresse. Réponse sous 24 h." },
};

const bloisPage: CityPageData = {
  kind: "city",
  path: paths.blois,
  title: "Développeur web à Blois et Loir-et-Cher · Hugo Feuilloy",
  description: "Développeur web freelance près de Blois, installé à Contres et formé à l’IUT de Blois. Sites pour commerces, artisans et associations du Loir-et-Cher.",
  h1: "Développeur web à Blois et dans le Loir-et-Cher",
  breadcrumb: "Développeur web à Blois",
  intro: "Je suis Hugo Feuilloy, développeur web freelance installé à Contres, près de Blois. Je crée des sites pour les commerces, artisans, indépendants et associations du Loir-et-Cher, et je les suis après la mise en ligne.",
  sections: [
    {
      title: "Un développeur du coin",
      blocks: [
        {
          type: "p",
          text: "J’ai été formé à l’IUT de Blois et je travaille depuis Contres. Travailler avec quelqu’un de proche, c’est pouvoir se rencontrer, voir votre boutique ou votre atelier, et comprendre votre clientèle avant de dessiner quoi que ce soit.",
        },
        {
          type: "p",
          text: "Pas d’agence ni de sous-traitant : la personne que vous rencontrez est celle qui conçoit votre site, le développe, puis s’en occupe dans le temps.",
        },
      ],
    },
    {
      title: "Rendez-vous à Blois ou en visio",
      blocks: [
        {
          type: "p",
          text: "Le premier échange peut se faire autour d’un café à Blois, ou en visio si c’est plus simple pour vous. Les points d’étape suivent la même logique : en personne quand c’est utile, à distance quand ça vous fait gagner du temps.",
        },
        { type: "todo", text: "TODO_HUGO : préciser si vous vous déplacez chez le client, et dans quel rayon autour de Contres." },
      ],
    },
    {
      title: "Les communes où j’interviens",
      blocks: [
        { type: "p", text: "Je travaille avec les entreprises et les associations de tout le secteur, notamment à :" },
        { type: "list", items: ["Blois", "Contres", "Cour-Cheverny", "Vendôme", "Romorantin-Lanthenay"] },
        {
          type: "p",
          text: "Et plus largement dans tout le Loir-et-Cher. Si votre projet est plus loin, ce n’est pas un obstacle : je travaille aussi avec des clients partout en France, entièrement à distance.",
        },
      ],
    },
    {
      title: "Un projet local : Les Belles Demois’Ailes",
      blocks: [
        {
          type: "p",
          text: `Les Belles Demois’Ailes est une miellerie artisanale de Contres. Son site lui permet de vendre sa production en direct, sans intermédiaire. J’ai raconté le projet dans [l’étude de cas Les Belles Demois’Ailes](${paths.caseStudy}).`,
        },
      ],
    },
    {
      title: "Être trouvé par les clients du coin",
      blocks: [
        {
          type: "p",
          text: "Quand quelqu’un cherche un artisan ou un commerce, il cherche souvent près de chez lui, en ajoutant le nom de sa ville à sa recherche. Pour une entreprise locale, être bien placé sur ces recherches compte davantage que d’être visible dans toute la France.",
        },
        {
          type: "p",
          text: `C’est pour cela que le référencement local de base et la fiche Google Business font partie de l’offre de [création de site vitrine](${paths.vitrine}) : pour que vos voisins vous trouvent quand ils ont besoin de vous.`,
        },
      ],
    },
    {
      title: "Ce que je peux faire pour vous",
      blocks: [
        {
          type: "p",
          text: `Selon votre besoin : un [site vitrine](${paths.vitrine}) pour présenter votre activité et recevoir des demandes, une [boutique en ligne](${paths.boutique}) pour vendre vos produits, ou la [maintenance](${paths.maintenance}) d’un site déjà en ligne. Pour un besoin plus spécifique, comme une réservation, un espace client ou un outil métier, l’offre ${surMesure.name} est ${surMesure.price.toLowerCase()}.`,
        },
        { type: "p", text: "Dans tous les cas, le premier échange est sans engagement, et je vous réponds sous 24 h." },
      ],
    },
  ],
  related: [serviceLinks.vitrine, serviceLinks.boutique, serviceLinks.maintenance],
  cta: { title: "Un projet dans le Loir-et-Cher ?", text: "Parlons-en à Blois ou en visio. Réponse sous 24 h, sans jargon et sans engagement." },
};

const caseStudyPage: CaseStudyPageData = {
  kind: "case",
  path: paths.caseStudy,
  title: "Les Belles Demois’Ailes, étude de cas · Hugo Feuilloy",
  description: "Étude de cas : la boutique en ligne des Belles Demois’Ailes, miellerie artisanale de Contres qui vend désormais sa production en direct.",
  h1: "Les Belles Demois’Ailes : la boutique en ligne d’une miellerie",
  breadcrumb: "Les Belles Demois’Ailes",
  intro: "Une miellerie artisanale de Contres, dans le Loir-et-Cher, qui vend désormais sa production en direct, sans intermédiaire.",
  client: "Les Belles Demois’Ailes",
  siteUrl: "https://lesbellesdemoisailes.fr/",
  siteLabel: "Voir le site",
  sections: [
    {
      title: "Le client",
      blocks: [
        {
          type: "p",
          text: "Les Belles Demois’Ailes est une miellerie artisanale installée à Contres. Son site présente deux univers : le miel et les produits du terroir d’un côté, le travail de la cire et des fleurs de l’autre.",
        },
        { type: "shots", slug: "les-belles-demois-ailes", name: "Les Belles Demois’Ailes" },
      ],
    },
    { title: "Le besoin", blocks: [{ type: "todo", text: "TODO_HUGO : décrire la situation de départ et ce que la miellerie attendait du site." }] },
    {
      title: "Ce que j’ai fait",
      blocks: [{ type: "todo", text: "TODO_HUGO : décrire le travail réalisé (conception, boutique, retrait, formation…) et les choix importants." }],
    },
    {
      title: "Le résultat",
      blocks: [
        { type: "p", text: "La miellerie vend aujourd’hui sa production en direct, depuis son propre site, sans passer par un intermédiaire." },
        { type: "todo", text: "TODO_HUGO : résultats concrets et, si le client est d’accord, son témoignage." },
      ],
    },
  ],
  related: [serviceLinks.boutique, serviceLinks.blois],
  cta: { title: "Un projet similaire ?", text: "Vous vendez vos produits et voulez le faire en ligne ? Décrivez votre projet, je vous réponds sous 24 h." },
};

const priceArticle: ArticlePageData = {
  kind: "article",
  path: paths.priceArticle,
  title: "Combien coûte un site vitrine ? · Hugo Feuilloy",
  description: "Ce qui fait varier le prix d’un site vitrine, la différence entre Wix et un site sur mesure, et les coûts annuels à prévoir. Avec des tarifs concrets.",
  h1: "Combien coûte un site vitrine ?",
  breadcrumb: "Prix d’un site vitrine",
  published: "2026-10-22",
  publishedLabel: "22 octobre 2026",
  intro:
    "C’est souvent la première question, et la réponse honnête est : ça dépend. Pas pour éviter de répondre, mais parce que deux sites vitrines peuvent demander un travail très différent. Voici ce qui fait varier le prix, ce qu’il faut prévoir chaque année, et mes propres tarifs comme exemple concret.",
  sections: [
    {
      title: "Ce qui fait varier le prix",
      blocks: [
        {
          type: "points",
          items: [
            {
              title: "Le nombre de pages",
              text: "Une page d’accueil, une page de services et une page de contact ne demandent pas le même travail qu’un site avec une page par prestation. Chaque page se conçoit, se met en forme et se vérifie.",
            },
            {
              title: "Les textes",
              text: "Si vous fournissez vos textes, le travail porte sur leur mise en page. S’il faut les écrire, c’est un vrai travail de rédaction, qui demande de bien comprendre votre métier.",
            },
            {
              title: "Les photos",
              text: "Vos propres photos montrent votre vrai commerce et votre vraie équipe. Sans photos utilisables, il faut prévoir une séance ou des visuels à trouver.",
            },
            {
              title: "Les fonctionnalités",
              text: "Présenter une activité et recevoir des demandes reste simple. Une prise de rendez-vous, plusieurs langues ou un espace réservé demandent davantage de développement.",
            },
            {
              title: "La maintenance",
              text: "Le prix de création n’est pas le seul coût : un site doit être hébergé et mis à jour tant qu’il est en ligne. On y revient plus bas.",
            },
          ],
        },
      ],
    },
    {
      title: "Wix ou site sur mesure : quelle différence ?",
      blocks: [
        {
          type: "p",
          text: "Les créateurs de sites comme Wix vous permettent de construire votre site vous-même à partir d’un modèle, contre un abonnement. C’est une solution valable si vous avez le temps, l’envie de vous en occuper et un besoin simple.",
        },
        {
          type: "p",
          text: "Un site sur mesure est conçu pour votre activité plutôt qu’adapté d’un modèle. Vous n’y passez pas vos soirées, quelqu’un s’occupe de la technique pour vous, et le site vous appartient. En contrepartie, l’investissement de départ est plus élevé.",
        },
        {
          type: "p",
          text: "La bonne question n’est donc pas « lequel est le moins cher ? », mais « combien de temps suis-je prêt à y consacrer, et quelle image est-ce que je veux donner ? ».",
        },
      ],
    },
    {
      title: "Mes tarifs, pour un exemple concret",
      blocks: [
        {
          type: "p",
          text: `Chez moi, un site vitrine démarre à ${vitrine.price}. À ce prix : jusqu’à 5 pages, la maquette avant le développement, un site rapide qui s’adapte aux mobiles, le référencement local de base et la fiche Google Business. Le montant exact figure dans un devis détaillé, que j’envoie après un premier échange.`,
        },
        {
          type: "p",
          text: `Pour situer le reste : une boutique en ligne démarre à ${boutique.price}, et les projets sur mesure (réservation, espace client, outil métier) sont ${surMesure.price.toLowerCase()}. Le détail de l’offre est sur la page [création de site vitrine](${paths.vitrine}).`,
        },
      ],
    },
    {
      title: "Les coûts récurrents à prévoir",
      blocks: [
        { type: "p", text: "Une fois le site en ligne, trois postes reviennent chaque année :" },
        {
          type: "points",
          items: [
            { title: "Le nom de domaine", text: "L’adresse de votre site, du type votre-entreprise.fr. Il se renouvelle chaque année pour rester à vous." },
            { title: "L’hébergement", text: "Le serveur sur lequel votre site est installé. Sans lui, personne ne peut le consulter." },
            { title: "Les mises à jour et la sécurité", text: "Un site qu’on n’entretient pas devient vulnérable avec le temps, même s’il fonctionne bien le jour de sa mise en ligne." },
          ],
        },
        { type: "todo", text: "TODO_HUGO : préciser si le prix du nom de domaine est compris dans les formules de maintenance ou facturé à part." },
        {
          type: "p",
          text: `Chez moi, ces postes sont regroupés dans les formules de [maintenance](${paths.maintenance}), ${maintenance.priceLabel} et sans engagement. La formule ${essentiel.name} couvre l’hébergement, la gestion du nom de domaine et les sauvegardes ; les mises à jour de sécurité commencent avec la formule ${pro.name}.`,
        },
      ],
    },
    {
      title: "En résumé",
      blocks: [
        {
          type: "p",
          text: "Le prix d’un site vitrine dépend de votre projet : le nombre de pages, les textes, les photos et les fonctionnalités. Ajoutez un budget annuel pour le garder en ligne et à jour. Le moyen le plus simple d’avoir un chiffre précis reste de décrire votre projet : je vous réponds sous 24 h, avec des questions ou un devis.",
        },
      ],
    },
  ],
  related: [serviceLinks.vitrine, serviceLinks.maintenance],
  cta: { title: "Un chiffre précis pour votre site ?", text: "Décrivez votre activité et ce que vous attendez du site. Réponse sous 24 h, sans engagement." },
};

export const contentPages: ContentPage[] = [vitrinePage, boutiquePage, maintenancePage, bloisPage, caseStudyPage, priceArticle];

export function findContentPage(path: string) {
  return contentPages.find((page) => page.path === path);
}

/** Liens du footer : services et ressources. */
export const footerLinks = {
  services: [serviceLinks.vitrine, serviceLinks.boutique, serviceLinks.maintenance, serviceLinks.blois].map(({ label, href }) => ({ label, href })),
  resources: [{ label: "Prix d’un site vitrine", href: paths.priceArticle }],
};
