export type ProjectTheme = {
  background: string;
  text: string;
  muted: string;
  label: string;
  link: string;
  border?: string;
  placeholder: [string, string, string];
};

export type Project = {
  slug: string;
  name: string;
  label: string;
  description: string;
  linkLabel: string;
  url?: string;
  reversed?: boolean;
  theme: ProjectTheme;
};

export const projectsIntro = {
  title: "Réalisations",
  text: "Chaque projet part d’un besoin réel, pas d’un template.",
};

export const projects: Project[] = [
  {
    slug: "la-delicatesse",
    name: "La Délicatesse",
    label: "Boutique en ligne · Contres",
    description: "Une fleuriste qui vendait sur Instagram, aujourd’hui avec une vraie boutique en ligne pour ses fleurs séchées.",
    linkLabel: "Voir le site",
    theme: {
      background: "#EEF0E7",
      text: "#16170F",
      muted: "#4F5246",
      label: "#4F5246",
      link: "#4B2FD6",
      placeholder: ["#F8F8F3", "#9DB383", "#D9DECB"],
    },
  },
  {
    slug: "les-belles-demois-ailes",
    name: "Les Belles Demois’Ailes",
    label: "E-commerce · Cour-Cheverny",
    description: "Une miellerie artisanale qui vend désormais sa production en direct, sans intermédiaire.",
    linkLabel: "Voir le site",
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
    slug: "la-trinquerie",
    name: "La Trinquerie",
    label: "Concept · Site vitrine",
    description: "Identité visuelle et maquette pour un bar : carte, événements et réservation en ligne.",
    linkLabel: "Voir le concept",
    theme: {
      background: "#17120C",
      text: "#F3E9D7",
      muted: "#C9BBA3",
      label: "#E0A84B",
      link: "#E0A84B",
      border: "rgba(224,168,75,0.22)",
      placeholder: ["#221A11", "#E0A84B", "#3A2C1C"],
    },
  },
];
