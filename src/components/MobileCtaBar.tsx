import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { primaryCta } from "../data/site";
import { useMenuOpen } from "../hooks/menuState";
import { scrollToHash } from "../hooks/useLenis";
import { primaryButton, useIsMobile } from "./primitives";

function useSectionsInView() {
  const isMobile = useIsMobile();
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    if (!isMobile) return;
    const hero = document.querySelector("[data-hero]");
    const contact = document.querySelector("#contact");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
        if (entry.target === contact) setContactVisible(entry.isIntersecting);
      }
    });
    if (hero) observer.observe(hero);
    if (contact) observer.observe(contact);
    return () => observer.disconnect();
  }, [isMobile]);

  return isMobile && !heroVisible && !contactVisible;
}

export function MobileCtaBar() {
  const menuOpen = useMenuOpen();
  const visible = useSectionsInView() && !menuOpen;

  return (
    <motion.div
      initial={false}
      animate={{ y: visible ? "0%" : "100%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      inert={!visible}
      className="fixed inset-x-0 bottom-0 z-10 border-t border-white/[0.07] bg-[rgba(11,10,18,0.85)] px-3 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-xl backdrop-saturate-150 md:hidden"
    >
      <a
        href={primaryCta.href}
        onClick={(event) => {
          if (scrollToHash(primaryCta.href)) event.preventDefault();
        }}
        className={`${primaryButton} w-full max-md:h-[52px]`}
      >
        {primaryCta.label}
      </a>
    </motion.div>
  );
}
