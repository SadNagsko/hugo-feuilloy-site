import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, site } from "../data/site";
import { pressable } from "./primitives";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onPointer = (event: PointerEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const panel = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: -8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.98 },
        transition: { type: "spring" as const, bounce: 0, duration: 0.35 },
      };

  const glass = "border border-white/[0.07] bg-[rgba(11,10,18,0.72)] backdrop-blur-xl backdrop-saturate-150";

  return (
    <div data-site-nav className="sticky top-0 z-20 px-4 pt-3.5">
      <div ref={barRef} className="relative mx-auto max-w-[1200px]">
        <header className={`rounded-[18px] py-2 pr-2 pl-4 ${glass}`}>
          <nav aria-label="Navigation principale" className="flex items-center justify-between gap-4">
            <a href="#top" className={`flex min-h-11 items-center gap-2.5 rounded-[12px] ${pressable}`}>
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-[9px] bg-violet-strong text-[13px] font-bold text-white">
                {site.initials}
              </span>
              <span className="text-[15px] font-semibold">{site.name}</span>
            </a>

            <div className="flex items-center gap-2 md:gap-[30px]">
              <ul className="hidden items-center gap-[30px] md:flex">
                {nav.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className={`inline-flex min-h-11 items-center text-[14px] font-medium text-muted transition-[color,transform] hover:text-ink ${pressable}`}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`inline-flex h-10 min-h-10 items-center rounded-[12px] bg-violet-strong px-[18px] text-[14px] font-semibold whitespace-nowrap text-white hover:bg-violet ${pressable}`}
              >
                Devis gratuit
              </a>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={open}
                aria-controls="menu-mobile"
                className={`grid size-11 place-items-center rounded-[12px] text-ink hover:bg-white/[0.06] md:hidden ${pressable}`}
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  {open ? <path d="M5 5l10 10M15 5 5 15" /> : <path d="M3.5 7h13M3.5 13h13" />}
                </svg>
              </button>
            </div>
          </nav>
        </header>

        <AnimatePresence>
          {open && (
            <motion.div
              id="menu-mobile"
              {...panel}
              style={{ transformOrigin: "top center" }}
              className={`absolute inset-x-0 top-full mt-2 rounded-[18px] p-2 md:hidden ${glass}`}
            >
              <ul>
                {nav.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`flex min-h-12 items-center rounded-[12px] px-3 text-[16px] font-medium text-ink hover:bg-white/[0.05] ${pressable}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
