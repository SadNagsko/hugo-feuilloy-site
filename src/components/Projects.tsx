import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { projects, projectsIntro, type Project } from "../data/projects";
import { ArrowUpRight, Container, Dot, useImageStatus, useReducedMotionSafe } from "./primitives";
import { Reveal } from "./Reveal";

type ShotProps = {
  src: string;
  alt: string;
  colors: [string, string, string];
  variant: "desktop" | "mobile";
};

function Shot({ src, alt, colors, variant }: ShotProps) {
  const { status, imageProps } = useImageStatus();
  const [base, accent, soft] = colors;

  return (
    <div className="absolute inset-0" style={{ backgroundColor: base }}>
      <div aria-hidden="true" className={variant === "desktop" ? "flex h-full flex-col gap-[6%] p-[6%]" : "flex h-full flex-col gap-3 p-4 pt-9"}>
        <div className="flex items-center justify-between">
          <span className="h-2.5 w-1/4 rounded-full" style={{ backgroundColor: accent }} />
          {variant === "desktop" && <span className="h-2.5 w-1/3 rounded-full" style={{ backgroundColor: soft }} />}
        </div>
        <div className={variant === "desktop" ? "grid flex-1 grid-cols-2 gap-[6%]" : "flex flex-1 flex-col gap-3"}>
          <div className="flex flex-col justify-center gap-3">
            <span className="h-4 w-4/5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="h-4 w-3/5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="mt-2 h-2 w-full rounded-full" style={{ backgroundColor: soft }} />
            <span className="h-2 w-4/5 rounded-full" style={{ backgroundColor: soft }} />
          </div>
          <div className="min-h-16 flex-1 rounded-xl" style={{ backgroundColor: soft }} />
        </div>
      </div>
      {status !== "error" && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          {...imageProps}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

const hoverSpring = { type: "spring", bounce: 0, duration: 0.45 } as const;

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const { theme, url } = project;
  const hoverable = Boolean(url) && !reduceMotion;

  const cardClass = `flex flex-wrap items-center gap-12 rounded-[32px] p-6 sm:p-10 lg:p-14 ${project.reversed ? "flex-row-reverse" : ""}`;
  const cardStyle = {
    backgroundColor: theme.background,
    color: theme.text,
    boxShadow: theme.border ? `inset 0 0 0 1px ${theme.border}` : undefined,
  };

  const content = (
    <>
      <div className="min-w-0 flex-[1_1_300px]">
        <p className="text-[14px] font-medium" style={{ color: theme.label }}>
          {project.label}
        </p>
        <h3 className="mt-4 text-[clamp(30px,3.4vw,44px)] leading-[1] font-bold tracking-[-0.045em]">{project.name}</h3>
        <p className="mt-5 text-[18px] leading-[1.5]" style={{ color: theme.muted }}>
          {project.description}
        </p>
        {url && (
          <span className="mt-7 inline-flex min-h-11 items-center gap-1.5 text-[17px] font-semibold" style={{ color: theme.link }}>
            {project.linkLabel}
            <ArrowUpRight className="size-4" />
          </span>
        )}
      </div>

      <div className="relative h-[300px] min-w-0 flex-[2_1_520px] sm:h-[380px]">
        <motion.div
          variants={hoverable ? { hover: { scale: 1.02 } } : undefined}
          transition={hoverSpring}
          className={`absolute top-0 h-[86%] w-[90%] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.18)] ${project.reversed ? "right-0" : "left-0"}`}
        >
          <Shot src={`/projets/${project.slug}-desktop.webp`} alt={`Page d’accueil du site ${project.name}`} colors={theme.placeholder} variant="desktop" />
        </motion.div>
        <motion.div
          variants={hoverable ? { hover: { y: -6 } } : undefined}
          transition={hoverSpring}
          className={`absolute bottom-0 h-[240px] w-[120px] overflow-hidden rounded-[24px] border-[6px] border-[#0A0A0C] bg-[#0A0A0C] shadow-[0_24px_50px_rgba(0,0,0,0.28)] sm:h-[320px] sm:w-[160px] sm:rounded-[28px] ${project.reversed ? "left-0" : "right-0"}`}
        >
          <div className="relative h-full overflow-hidden rounded-[18px] sm:rounded-[22px]">
            <Shot src={`/projets/${project.slug}-mobile.webp`} alt={`Version mobile du site ${project.name}`} colors={theme.placeholder} variant="mobile" />
          </div>
        </motion.div>
      </div>
    </>
  );

  return (
    <motion.div ref={ref} style={reduceMotion ? undefined : { scale, opacity }}>
      {url ? (
        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.linkLabel} ${project.name} (nouvel onglet)`}
          whileHover={hoverable ? "hover" : undefined}
          style={cardStyle}
          className={`${cardClass} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet`}
        >
          {content}
        </motion.a>
      ) : (
        <article style={cardStyle} className={cardClass}>
          {content}
        </article>
      )}
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="realisations" className="py-[110px] md:py-[160px]">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h2 className="text-[clamp(44px,5.6vw,80px)] leading-[0.96] font-bold tracking-[-0.05em]">
            {projectsIntro.title}
            <Dot />
          </h2>
          <p className="max-w-[380px] text-[19px] leading-[1.45] text-muted">{projectsIntro.text}</p>
        </Reveal>
        <div className="mt-14 flex flex-col gap-6 md:mt-20">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
