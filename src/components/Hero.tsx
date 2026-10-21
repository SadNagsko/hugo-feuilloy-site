import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { hero, primaryCta } from "../data/site";
import { Chevron, Container, Dot, EASE, mobileText, pressable, primaryButton, useReducedMotionSafe } from "./primitives";

const ENTRANCE_DELAYS = [0.08, 0.2, 0.34, 0.52];
const LINE_STAGGER = 0.12;
const lineMask = "block overflow-hidden pb-[0.12em] -mb-[0.12em]";

function useRotatingIndex(length: number, intervalMs: number, enabled: boolean) {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === "hidden");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!enabled || hidden) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % length), intervalMs);
    return () => window.clearInterval(timer);
  }, [enabled, hidden, length, intervalMs]);

  return index;
}

export function Hero() {
  const reduceMotion = useReducedMotionSafe();
  const [entered, setEntered] = useState(false);
  const index = useRotatingIndex(hero.words.length, hero.intervalMs, !reduceMotion && entered);
  const word = hero.words[index];

  const enter = (step: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay: ENTRANCE_DELAYS[step] },
  });

  const line = (step: number) => ({
    initial: { y: "100%" },
    animate: { y: "0%" },
    transition: { duration: 0.8, ease: EASE, delay: ENTRANCE_DELAYS[1] + step * LINE_STAGGER },
  });

  const allWords = `${hero.words.slice(0, -1).join(", ")} et ${hero.words[hero.words.length - 1]}`;

  return (
    <section data-hero className="flex min-h-[calc(100svh-70px)] flex-col max-md:min-h-[calc(100svh-72px)]">
      <Container className="flex flex-1 flex-col items-center justify-center gap-[34px] py-20 text-center">
        <motion.h1 {...enter(0)} className="text-[15px] font-normal text-muted max-md:text-[14px]">
          {hero.heading}
        </motion.h1>

        <p className="w-full text-[clamp(56px,9.4vw,148px)] leading-[0.94] font-bold tracking-[-0.055em] max-md:text-[58px] max-md:text-balance max-[379.98px]:text-[54px]">
          <span className="sr-only">
            {hero.lead} {allWords}.
          </span>
          <span aria-hidden="true">
            <span className={lineMask}>
              <motion.span className="block" {...line(0)}>
                {hero.lead}
              </motion.span>
            </span>
            <span className={lineMask}>
              <motion.span className="relative block min-h-[1em] whitespace-nowrap" {...line(1)} onAnimationComplete={() => setEntered(true)}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={word}
                    className="inline-block"
                    initial={{ opacity: 0, y: "0.3em", filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: "-0.2em", transition: { duration: 0.35, ease: EASE } }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    {word}
                    <Dot />
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </span>
          </span>
        </p>

        <motion.p {...enter(2)} className={`max-w-[600px] text-[19px] leading-[1.45] text-muted sm:text-[21px] max-md:text-balance ${mobileText}`}>
          <span className="max-md:hidden">{hero.textLead}</span>
          <span className="max-md:block max-md:first-letter:uppercase">{hero.text}</span>
        </motion.p>

        <motion.div {...enter(3)} className="flex flex-col items-center gap-x-8 gap-y-4 sm:flex-row max-md:w-full max-md:flex-col max-md:items-center max-md:gap-y-2">
          <a href={primaryCta.href} className={`${primaryButton} max-md:w-full`}>
            {primaryCta.label}
          </a>
          <a href={hero.secondary.href} className={`inline-flex min-h-11 items-center gap-1 text-[17px] max-md:min-h-12 font-medium text-violet-soft hover:text-ink ${pressable}`}>
            {hero.secondary.label}
            <Chevron />
          </a>
        </motion.div>
      </Container>

      <div className="border-t border-white/[0.07]">
        <Container>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 py-6 text-[14px] text-muted max-md:gap-x-4 md:grid-cols-4 md:text-center">
            {hero.proof.map((item) => (
              <li
                key={item.text}
                className={`max-md:flex max-md:items-center max-md:justify-center max-md:gap-2 max-md:text-center ${item.only === "mobile" ? "md:hidden" : ""} ${item.only === "desktop" ? "max-md:hidden" : ""}`}
              >
                <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-violet md:hidden" />
                {item.text}
                {item.desktopSuffix && <span className="max-md:hidden">{item.desktopSuffix}</span>}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
