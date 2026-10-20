import { site } from "./site";

export const legal = {
  status: "entrepreneur individuel",
  address: "[À COMPLÉTER : adresse de domiciliation de l’entreprise, 41700 Contres]",
  phone: "[À COMPLÉTER : numéro professionnel]",
  siret: "[À COMPLÉTER : n° SIRET]",
  vat: "TVA non applicable, article 293 B du Code général des impôts.",
  publicationDirector: site.name,
  host: {
    name: "Castle IT [À CONFIRMER : raison sociale exacte]",
    address: "17 rue des Granges Galland, 37550 Saint-Avertin, France",
    phone: "[À COMPLÉTER : téléphone de l’hébergeur]",
  },
  photoCredits: "[À COMPLÉTER : auteur des photos, notamment le portrait, et des visuels des réalisations]",
  updated: "[À COMPLÉTER : date de mise en ligne]",
};

export type LegalBlock = string | string[];
export type LegalSection = { title: string; blocks: LegalBlock[] };
export type LegalDocument = { title: string; sections: LegalSection[] };

export const legalNotice: LegalDocument = {
  title: "Mentions légales",
  sections: [
    {
      title: "Éditeur du site",
      blocks: [
        `Le site ${new URL(site.url).hostname} est édité par ${site.legalName} (${legal.status}).`,
        [
          `Adresse : ${legal.address}`,
          `Email : ${site.email}`,
          `Téléphone : ${legal.phone}`,
          `SIRET : ${legal.siret}, immatriculé au Registre national des entreprises (RNE)`,
          legal.vat,
        ],
      ],
    },
    {
      title: "Directeur de la publication",
      blocks: [`${legal.publicationDirector}.`],
    },
    {
      title: "Hébergement",
      blocks: [[legal.host.name, legal.host.address, `Téléphone : ${legal.host.phone}`]],
    },
    {
      title: "Propriété intellectuelle",
      blocks: [
        `L’ensemble des contenus de ce site (textes, visuels, logo, mise en page, code) est la propriété de ${site.legalName}, sauf mention contraire. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.`,
        "Les réalisations présentées dans le portfolio restent la propriété de leurs clients respectifs et sont reproduites avec leur accord.",
      ],
    },
    {
      title: "Crédits",
      blocks: [[`Conception et développement : ${site.name}`, `Photographies : ${legal.photoCredits}`, "Police : Inter Tight, sous licence SIL Open Font License 1.1"]],
    },
    {
      title: "Données personnelles",
      blocks: ["Le traitement des données transmises via le formulaire de contact est décrit dans la politique de confidentialité."],
    },
  ],
};

export const privacyPolicy: LegalDocument = {
  title: "Politique de confidentialité",
  sections: [
    {
      title: "Qui est responsable de vos données ?",
      blocks: [`${site.legalName}, ${legal.address}, ${site.email}.`],
    },
    {
      title: "Quelles données sont collectées, et pourquoi ?",
      blocks: [
        "Le site ne collecte des données que lorsque vous remplissez le formulaire de contact :",
        ["obligatoires : nom, adresse email, message ;", "facultatives : entreprise, téléphone, type de besoin, budget indicatif."],
        "Ces données servent uniquement à répondre à votre demande et, si vous le souhaitez, à établir un devis. Base légale : mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).",
        "Pour limiter les envois abusifs, l’adresse IP de l’expéditeur est conservée une heure sur le serveur, sous une forme hachée qui ne permet pas de la retrouver.",
      ],
    },
    {
      title: "Qui reçoit vos données ?",
      blocks: [
        `${site.name} uniquement. Le formulaire est envoyé au serveur du site, hébergé en France, qui le transmet par email à la boîte de réception de ${site.name}.`,
        "Cette boîte de réception est hébergée par Google (Gmail). Google peut traiter des données hors de l’Union européenne ; ce transfert est encadré par [À CONFIRMER : Data Privacy Framework UE–États-Unis ou clauses contractuelles types de la Commission européenne].",
        "Vos données ne sont jamais vendues ni utilisées à des fins publicitaires.",
      ],
    },
    {
      title: "Combien de temps sont-elles conservées ?",
      blocks: [
        [
          "Demande sans suite : 3 ans à compter du dernier échange, puis suppression.",
          "Demande devenue un contrat : pendant la durée de la relation commerciale, puis selon les durées légales (10 ans pour les pièces comptables).",
        ],
      ],
    },
    {
      title: "Cookies",
      blocks: [
        "Ce site ne dépose aucun cookie ni traceur nécessitant votre consentement. Aucun outil de mesure d’audience ni aucun contenu publicitaire n’est utilisé, et les polices sont hébergées sur le site. C’est pourquoi aucun bandeau cookies ne s’affiche.",
      ],
    },
    {
      title: "Vos droits",
      blocks: [
        `Vous pouvez à tout moment accéder à vos données, les rectifier, les effacer, en limiter le traitement, vous opposer à leur traitement ou demander leur portabilité, en écrivant à ${site.email}. Une réponse vous est apportée dans un délai d’un mois.`,
        "Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (www.cnil.fr).",
      ],
    },
  ],
};
