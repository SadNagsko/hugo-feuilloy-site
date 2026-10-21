import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { projects, projectsIntro, type ClientProject, type PersoProject, type Project } from "../data/projects";
import { ArrowUpRight, Container, Dot, mobileText, useImageStatus, useIsMobile, useReducedMotionSafe } from "./primitives";
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

function ProjectLink({ label, color, className }: { label: string; color: string; className: string }) {
  return (
    <span className={`inline-flex min-h-11 items-center gap-1.5 text-[17px] font-semibold ${className}`} style={{ color }}>
      {label}
      <ArrowUpRight className="size-4" />
    </span>
  );
}

const hoverSpring = { type: "spring", bounce: 0, duration: 0.45 } as const;

function ScrollCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  const isMobile = useIsMobile();
  const scale = useTransform(scrollYProgress, [0, 1], [isMobile ? 0.96 : 0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  return (
    <motion.div ref={ref} style={reduceMotion ? { scale: 1, opacity: 1 } : { scale, opacity }}>
      {children}
    </motion.div>
  );
}

const cardLayout = (reversed?: boolean) =>
  `flex flex-wrap items-center gap-12 rounded-[32px] p-6 sm:p-10 lg:p-14 max-md:flex-col max-md:flex-nowrap max-md:items-stretch max-md:gap-0 max-md:rounded-[24px] max-md:p-6 ${reversed ? "flex-row-reverse" : ""}`;
const textColumn = "min-w-0 flex-[1_1_300px] max-md:contents";
const visualZone = "relative h-[300px] min-w-0 flex-[2_1_520px] sm:h-[380px] max-md:mt-6 max-md:aspect-[16/10] max-md:h-auto max-md:flex-none";
const eyebrowText = "text-[14px] font-medium max-md:text-[13px]";
const titleText = "mt-4 text-[clamp(30px,3.4vw,44px)] leading-[1] font-bold tracking-[-0.045em] max-md:mt-3 max-md:text-[32px]";
const descriptionText = "mt-5 text-[18px] leading-[1.5] max-md:mt-4 max-md:text-[16px]";

function ClientCard({ project }: { project: ClientProject }) {
  const reduceMotion = useReducedMotionSafe();
  const { theme, url } = project;
  const hoverable = Boolean(url) && !reduceMotion;

  const cardClass = cardLayout(project.reversed);
  const cardStyle = {
    backgroundColor: theme.background,
    color: theme.text,
    boxShadow: theme.border ? `inset 0 0 0 1px ${theme.border}` : undefined,
  };

  const content = (
    <>
      <div className={textColumn}>
        <p className={eyebrowText} style={{ color: theme.label }}>
          {project.label}
        </p>
        <h3 className={titleText}>{project.name}</h3>
        <p className={descriptionText} style={{ color: theme.muted }}>
          {project.description}
        </p>
        {url && <ProjectLink label={project.linkLabel} color={theme.link} className="mt-7 max-md:order-1 max-md:mt-4 max-md:self-start" />}
      </div>

      <div className={visualZone}>
        <motion.div
          variants={hoverable ? { hover: { scale: 1.02 } } : undefined}
          transition={hoverSpring}
          className={`absolute top-0 h-[86%] w-[90%] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.18)] max-md:inset-0 max-md:h-full max-md:w-full max-md:rounded-xl ${project.reversed ? "right-0" : "left-0"}`}
        >
          <Shot src={`/projets/${project.slug}-desktop.webp`} alt={`Page d’accueil du site ${project.name}`} colors={theme.placeholder} variant="desktop" />
        </motion.div>
        <motion.div
          variants={hoverable ? { hover: { y: -6 } } : undefined}
          transition={hoverSpring}
          className={`absolute bottom-0 h-[240px] w-[120px] overflow-hidden rounded-[24px] border-[6px] border-[#0A0A0C] bg-[#0A0A0C] shadow-[0_24px_50px_rgba(0,0,0,0.28)] sm:h-[320px] sm:w-[160px] sm:rounded-[28px] max-md:hidden ${project.reversed ? "left-0" : "right-0"}`}
        >
          <div className="relative h-full overflow-hidden rounded-[18px] sm:rounded-[22px]">
            <Shot src={`/projets/${project.slug}-mobile.webp`} alt={`Version mobile du site ${project.name}`} colors={theme.placeholder} variant="mobile" />
          </div>
        </motion.div>
      </div>
    </>
  );

  return url ? (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.linkLabel} ${project.name} (nouvel onglet)`}
      whileHover={hoverable ? "hover" : undefined}
      style={cardStyle}
      className={`${cardClass} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet max-md:transition-transform max-md:duration-[120ms] max-md:active:scale-[0.98]`}
    >
      {content}
    </motion.a>
  ) : (
    <article style={cardStyle} className={cardClass}>
      {content}
    </article>
  );
}

const FACE_INTERVAL_MS = 4000;
const finePointerQuery = "(hover: hover) and (pointer: fine)";
const subscribeFinePointer = (onChange: () => void) => {
  const media = window.matchMedia(finePointerQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/** Change d'expression toutes les 4 s, seulement quand la carte est visible et l'onglet affiché. */
function useFaceCycle(count: number, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !inView || !tabVisible) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), FACE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [enabled, inView, tabVisible, count]);

  return { ref, index: enabled ? index : 0 };
}

function PersoCard({ project }: { project: PersoProject }) {
  const reduceMotion = useReducedMotionSafe();
  const finePointer = useSyncExternalStore(subscribeFinePointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  const faces = useFaceCycle(project.faces.length, !reduceMotion);
  const hoverable = finePointer && !reduceMotion;
  const title = project.title.replace(/\.$/, "");

  return (
    <motion.article
      whileHover="hover"
      className={`${cardLayout(project.reversed)} bg-surface text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]`}
    >
      <div className={textColumn}>
        <p className={`${eyebrowText} text-violet-soft`}>{project.eyebrow}</p>
        <h3 className={titleText}>
          {title}
          <Dot />
        </h3>
        <p className={`${descriptionText} text-muted`}>{project.description}</p>
        <ul className="mt-6 flex flex-wrap gap-1.5 max-md:mt-4" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[12px] font-semibold text-[#DCD8E8]">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className={visualZone}>
        <div ref={faces.ref} className="absolute inset-0 grid place-items-center overflow-hidden rounded-2xl border border-white/[0.06] bg-bg">
          <motion.div
            variants={{ hover: hoverable ? { y: -6 } : {} }}
            transition={hoverSpring}
            className="relative aspect-square w-[34%] max-md:w-[38%]"
          >
            {project.faces.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={i === 0 ? project.alt : ""}
                aria-hidden={i === 0 ? undefined : true}
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-[600ms] ${faces.index === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return <ScrollCard>{project.type === "perso" ? <PersoCard project={project} /> : <ClientCard project={project} />}</ScrollCard>;
}

export function Projects() {
  return (
    <section id="realisations" className="py-24 max-md:pt-12 md:py-[160px]">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 max-md:flex-col max-md:items-center max-md:text-center">
          <h2 className="text-[clamp(44px,5.6vw,80px)] leading-[0.96] font-bold tracking-[-0.05em]">
            {projectsIntro.title}
            <Dot />
          </h2>
          <p className={`max-w-[380px] text-[19px] leading-[1.45] text-muted max-md:text-balance ${mobileText}`}>{projectsIntro.text}</p>
        </Reveal>
        <div className="mt-10 flex flex-col gap-6 md:mt-20">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
