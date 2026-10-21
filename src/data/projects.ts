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
    slug: "les-belles-demois-ailes",
    name: "Les Belles Demois’Ailes",
    label: "E-commerce · Contres",
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
];
