export type ProjectTheme = {
  background: string;
  text: string;
  muted: string;
  label: string;
  link: string;
  border?: string;
  placeholder: [string, string, string];
};

export type ClientProject = {
  type: "client";
  slug: string;
  name: string;
  label: string;
  description: string;
  linkLabel: string;
  url?: string;
  reversed?: boolean;
  theme: ProjectTheme;
};

export type PersoProject = {
  type: "perso";
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  faces: string[];
  alt: string;
  reversed?: boolean;
};

export type Project = ClientProject | PersoProject;

export const projectsIntro = {
  title: "Réalisations",
  text: "Chaque projet part d’un besoin réel, pas d’un template.",
};

export const projects: Project[] = [
  {
    type: "client",
    slug: "les-belles-demois-ailes",
    name: "Les Belles Demois’Ailes",
    label: "E-commerce · Contres",
    description: "Une miellerie artisanale qui vend désormais sa production en direct, sans intermédiaire.",
    linkLabel: "Voir le site",
    url: "https://lesbellesdemoisailes.fr/",
    reversed: true,
    theme: {
      background: "#F7EEDB",
      text: "#1E1709",
      muted: "#5C4F36",
      label: "#5C4F36",
      link: "#4B2FD6",
      placeholder: ["#FFFAF0", "#E2A93B", "#EFDDB6"],
    },
  },
  {
    type: "perso",
    slug: "nova",
    eyebrow: "Projet perso · Assistante sur mesure",
    title: "Nova.",
    description:
      "Mon assistante vocale, conçue et développée pour mon activité : elle suit mes projets, surveille les sites de mes clients et prépare leurs rapports mensuels. Je valide tout ce qu’elle produit.",
    tags: ["React", "Voix", "Automatisation", "IA"],
    faces: ["/projets/nova-face.webp", "/projets/nova-face-2.webp", "/projets/nova-face-3.webp"],
    alt: "Nova, l’assistante de Hugo",
  },
];
