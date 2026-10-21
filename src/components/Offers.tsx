import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  maintenance,
  maintenanceFeatures,
  maintenancePlans,
  offers,
  offersIntro,
  type MaintenanceFeature,
  type MaintenancePlan,
  type Offer,
} from "../data/offers";
import { Check, Chevron, Container, Dot, mobileText, pressable, springIn, useIsMobile, useReducedMotionSafe } from "./primitives";
import { Reveal } from "./Reveal";

type OfferCardProps = { offer: Offer; index: number; mobile: boolean; cardRef: (element: HTMLElement | null) => void };

function OfferCard({ offer, index, mobile, cardRef }: OfferCardProps) {
  const reduceMotion = useReducedMotionSafe();
  const reveal = { opacity: 1, y: 0, transition: { ...springIn, delay: index * 0.09 } };
  const motionProps = mobile
    ? { initial: { opacity: 0, y: 40 }, animate: reveal }
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: reveal,
        whileHover: reduceMotion ? undefined : { y: -4, transition: { type: "spring" as const, bounce: 0, duration: 0.35 } },
        viewport: { once: true, amount: 0.3 },
      };

  return (
    <motion.article
      ref={cardRef}
      {...motionProps}
      className={`flex flex-col rounded-[28px] border bg-surface p-8 sm:p-10 max-md:w-[85%] max-md:shrink-0 max-md:snap-center max-md:p-7 ${offer.badge ? "border-violet/40" : "border-white/[0.07]"}`}
    >
      <div className="flex min-h-7 items-center justify-between gap-3">
        <h3 className="text-[17px] font-semibold text-violet-soft">{offer.name}</h3>
        {offer.badge && <span className="rounded-full bg-violet/10 px-2.5 py-1 text-[12px] font-semibold text-violet-soft">{offer.badge}</span>}
      </div>
      <p className="mt-6 flex items-baseline gap-2">
        {offer.from && <span className="text-[17px] text-muted">dès</span>}
        <span className="text-[46px] leading-none font-bold tracking-[-0.045em]">{offer.price}</span>
      </p>
      <p className={`mt-5 text-[18px] leading-[1.45] text-muted ${mobileText}`}>{offer.text}</p>
      <ul className="mt-8">
        {offer.points.map((point) => (
          <li key={point} className="border-t border-white/[0.07] py-3.5 text-[16px]">
            {point}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function FeatureValue({ value }: { value: MaintenanceFeature["values"][MaintenancePlan["id"]] }) {
  if (typeof value === "string") return <span>{value}</span>;
  return value ? (
    <>
      <Check className="mx-auto text-violet-soft" />
      <span className="sr-only">Inclus</span>
    </>
  ) : (
    <>
      <span aria-hidden="true" className="text-subtle">
        —
      </span>
      <span className="sr-only">Non inclus</span>
    </>
  );
}

function PlanPrice({ plan, align }: { plan: MaintenancePlan; align: "center" | "start" }) {
  return (
    <span className={`flex items-baseline gap-1 ${align === "center" ? "justify-center" : "justify-start"}`}>
      <span className="text-[28px] leading-none font-bold tracking-[-0.03em]">{plan.monthlyPrice} €</span>
      <span className="text-[14px] font-normal text-muted">{maintenance.perMonth}</span>
    </span>
  );
}

function ComparisonTable() {
  const highlight = (plan: MaintenancePlan) => (plan.badge ? "border-x border-violet/30 bg-violet/[0.06]" : "");

  return (
    <table className="hidden w-full border-separate border-spacing-0 text-[15px] md:table">
      <caption className="sr-only">Comparatif des formules de suivi</caption>
      <thead>
        <tr>
          <td className="w-[34%]" />
          {maintenancePlans.map((plan) => (
            <th key={plan.id} scope="col" className={`rounded-t-[16px] px-4 pt-6 pb-5 text-center align-bottom font-semibold ${highlight(plan)} ${plan.badge ? "border-t" : ""}`}>
              <span className="flex items-center justify-center gap-2 text-[16px]">
                {plan.name}
                {plan.badge && <span className="rounded-full bg-violet/10 px-2.5 py-1 text-[12px] font-semibold text-violet-soft">{plan.badge}</span>}
              </span>
              <span className="mt-3 block">
                <PlanPrice plan={plan} align="center" />
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {maintenanceFeatures.map((feature, row) => {
          const last = row === maintenanceFeatures.length - 1;
          return (
            <tr key={feature.label}>
              <th scope="row" className="border-t border-white/[0.06] py-4 pr-4 text-left font-normal text-muted">
                {feature.label}
              </th>
              {maintenancePlans.map((plan) => (
                <td
                  key={plan.id}
                  className={`border-t border-t-white/[0.06] px-4 py-4 text-center ${highlight(plan)} ${plan.badge && last ? "rounded-b-[16px] border-b border-b-violet/30" : ""}`}
                >
                  <FeatureValue value={feature.values[plan.id]} />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ComparisonCards() {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {maintenancePlans.map((plan) => (
        <li key={plan.id} className={`rounded-[22px] border bg-bg-deep p-6 ${plan.badge ? "border-violet/40" : "border-white/[0.07]"}`}>
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-[17px] font-semibold">{plan.name}</h4>
            {plan.badge && <span className="rounded-full bg-violet/10 px-2.5 py-1 text-[12px] font-semibold text-violet-soft">{plan.badge}</span>}
          </div>
          <p className="mt-3">
            <PlanPrice plan={plan} align="start" />
          </p>
          <ul className="mt-5">
            {maintenanceFeatures
              .filter((feature) => feature.values[plan.id] !== false)
              .map((feature) => {
                const value = feature.values[plan.id];
                return (
                  <li key={feature.label} className="flex items-start gap-3 border-t border-white/[0.06] py-3 text-[15px]">
                    <Check className="mt-0.5 shrink-0 text-violet-soft" />
                    <span>
                      {feature.label}
                      {typeof value === "string" && <span className="text-muted"> · {value}</span>}
                    </span>
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function useActiveSlide(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const track = trackRef.current;
    if (!isMobile || !track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(slides.current.indexOf(entry.target as HTMLElement));
        }
      },
      { root: track, threshold: 0.6 },
    );
    slides.current.slice(0, count).forEach((slide) => slide && observer.observe(slide));
    return () => observer.disconnect();
  }, [isMobile, count]);

  const goTo = (index: number, smooth: boolean) => {
    const track = trackRef.current;
    const slide = slides.current[index];
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  };

  return { trackRef, slides, active, goTo, isMobile };
}

export function Offers() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotionSafe();
  const carousel = useActiveSlide(offers.length);
  const panelTransition = reduceMotion ? { duration: 0 } : { type: "spring" as const, bounce: 0, duration: 0.5 };

  return (
    <section id="offres" className="border-y border-white/[0.07] bg-bg-deep py-24 md:py-[150px]">
      <Container>
        <Reveal className="mx-auto max-w-[680px] text-center max-md:mx-0 max-md:text-left">
          <h2 className="text-[clamp(44px,5.6vw,80px)] leading-[0.96] font-bold tracking-[-0.05em]">
            {offersIntro.title}
            <Dot />
          </h2>
          <p className={`mt-6 text-[19px] leading-[1.45] text-muted sm:text-[21px] ${mobileText}`}>{offersIntro.text}</p>
        </Reveal>

        <div
          ref={carousel.trackRef}
          className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5 md:mt-20 max-md:-mx-5 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-3 max-md:overflow-x-auto max-md:px-5 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden"
        >
          {offers.map((offer, i) => (
            <OfferCard
              key={offer.name}
              offer={offer}
              index={i}
              mobile={carousel.isMobile}
              cardRef={(element) => {
                carousel.slides.current[i] = element;
              }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-center md:hidden">
          {offers.map((offer, i) => (
            <button
              key={offer.name}
              type="button"
              aria-label={`Voir l’offre ${offer.name}`}
              aria-current={carousel.active === i ? "true" : undefined}
              onClick={() => carousel.goTo(i, !reduceMotion)}
              className="grid h-11 place-items-center rounded-[12px] px-1"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-[12px] transition-[width,background-color] duration-300 ${carousel.active === i ? "w-5 bg-violet" : "w-1.5 bg-white/20"}`}
              />
            </button>
          ))}
        </div>

        <Reveal className="mt-5">
          <div className="rounded-[22px] border border-white/[0.07] bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 sm:px-8">
              <p className="text-[17px] leading-[1.45]">
                {maintenance.text} <span className="text-muted">· {maintenance.priceLabel}</span>
              </p>
              <button
                type="button"
                aria-expanded={open}
                aria-controls="formules"
                onClick={() => setOpen((value) => !value)}
                className={`-mx-3 inline-flex min-h-11 items-center gap-1.5 rounded-[12px] px-3 text-[16px] font-medium text-violet-soft hover:text-ink ${pressable}`}
              >
                {maintenance.toggleLabel}
                <motion.span
                  aria-hidden="true"
                  className="inline-flex"
                  animate={{ rotate: open ? 90 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.4 }}
                >
                  <Chevron />
                </motion.span>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id="formules"
                  key="formules"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={panelTransition}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/[0.07] px-4 pt-2 pb-6 sm:px-8">
                    <ComparisonTable />
                    <div className="pt-4 md:hidden">
                      <ComparisonCards />
                    </div>
                    <p className="mt-6 text-[13px] leading-[1.45] text-muted">{maintenance.note}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
