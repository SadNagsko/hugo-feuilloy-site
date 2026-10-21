import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { mobileMenuCta, nav, site } from "../data/site";
import { setMenuOpen } from "../hooks/menuState";
import { scrollToHash } from "../hooks/useLenis";
import { pressable, primaryButton } from "./primitives";

const barSpring = { type: "spring", bounce: 0, duration: 0.26 } as const;

const menuList: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const menuItem: Variants = {
  closed: { opacity: 0, y: 16 },
  open: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.5 } },
};

function useMenuBehaviour(open: boolean, close: () => void, panelRef: React.RefObject<HTMLDivElement | null>, toggleRef: React.RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const focusables = () =>
      [toggleRef.current, ...(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [])].filter((el): el is HTMLElement => Boolean(el));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => desktop.matches && close();

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus());

    return () => {
      cancelAnimationFrame(frame);
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, close, panelRef, toggleRef]);
}

export function Navbar({ home }: { home: boolean }) {
  const link = (href: string) => (home ? href : `/${href}`);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const close = useRef(() => setOpen(false)).current;
  useMenuBehaviour(open, close, panelRef, toggleRef);

  useEffect(() => {
    setMenuOpen(open);
    if (wasOpen.current && !open) toggleRef.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (!home || !href.startsWith("#")) return;
    event.preventDefault();
    requestAnimationFrame(() => scrollToHash(href));
  };

  const glass = "border border-white/[0.07] bg-[rgba(11,10,18,0.72)] backdrop-blur-xl backdrop-saturate-150 max-md:bg-[rgba(11,10,18,0.82)]";

  return (
    <div data-site-nav className="sticky top-0 z-20 px-4 pt-3.5 max-md:px-3 max-md:pt-3">
      <div className="relative mx-auto max-w-[1200px]">
        <header className={`relative z-10 rounded-[18px] py-2 pr-2 pl-4 max-md:rounded-[16px] ${glass}`}>
          <nav aria-label="Navigation principale" className="flex items-center justify-between gap-4">
            <a href={home ? "#top" : "/"} aria-label={`${site.name}, accueil`} className={`flex min-h-11 items-center gap-2.5 rounded-[12px] ${pressable}`}>
              <img src="/brand/hf-mark-on-dark.svg" alt="" width="32" height="32" className="size-8 shrink-0 max-md:size-[30px]" />
              <span className="text-[15px] font-semibold">{site.name}</span>
            </a>

            <div className="flex items-center gap-2 md:gap-[30px]">
              <ul className="hidden items-center gap-[30px] md:flex">
                {nav.map(({ label, href }) => (
                  <li key={href}>
                    <a href={link(href)} className={`inline-flex min-h-11 items-center text-[14px] font-medium text-muted transition-[color,transform] hover:text-ink ${pressable}`}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={link("#contact")}
                className={`inline-flex h-10 min-h-10 items-center rounded-[12px] bg-violet-strong px-[18px] text-[14px] font-semibold whitespace-nowrap text-white hover:bg-violet max-md:hidden ${pressable}`}
              >
                Devis gratuit
              </a>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={open}
                aria-controls="menu-mobile"
                className={`relative grid size-11 place-items-center rounded-[12px] text-ink hover:bg-white/[0.06] md:hidden ${pressable}`}
              >
                <span aria-hidden="true" className="relative block h-[9px] w-[18px]">
                  <motion.span
                    className="absolute top-0 left-0 block h-[2px] w-full rounded-full bg-current"
                    animate={open ? { y: 3.5, rotate: 45 } : { y: 0, rotate: 0 }}
                    transition={barSpring}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 block h-[2px] w-full rounded-full bg-current"
                    animate={open ? { y: -3.5, rotate: -45 } : { y: 0, rotate: 0 }}
                    transition={barSpring}
                  />
                </span>
              </button>
            </div>
          </nav>
        </header>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id="menu-mobile"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-0 flex flex-col bg-bg px-5 pt-[92px] pb-[calc(24px+env(safe-area-inset-bottom))] md:hidden"
            >
              <motion.ul variants={menuList} initial="closed" animate="open" className="flex flex-col">
                {nav.map(({ label, href }, i) => (
                  <motion.li key={href} variants={menuItem} className="border-b border-white/[0.06]">
                    <a
                      href={link(href)}
                      onClick={(event) => goTo(event, href)}
                      className={`flex items-center justify-between gap-4 rounded-[12px] py-[14px] text-[34px] leading-[1.1] font-bold tracking-[-0.035em] text-ink ${pressable}`}
                    >
                      {label}
                      <span aria-hidden="true" className="text-[13px] font-medium tracking-normal text-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={menuItem} initial="closed" animate="open" className="mt-auto flex flex-col gap-3">
                <p className="text-[15px] text-muted">{mobileMenuCta.text}</p>
                <a href={link(mobileMenuCta.href)} onClick={(event) => goTo(event, mobileMenuCta.href)} className={`${primaryButton} w-full`}>
                  {mobileMenuCta.label}
                </a>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center justify-center text-[15px] text-muted">
                  {site.email}
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
