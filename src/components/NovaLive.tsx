import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Companion, CompanionState } from "../lib/nova/companion.js";

// Durée de l'animation d'apparition du module (born : 0 → 1 en 40 frames).
const BIRTH_MS = 700;

export type NovaLiveHandle = { setState: (state: CompanionState) => void };

type Props = { fallback: string; label: string };

/**
 * Nova dessinée en direct dans un canvas. Le module est chargé côté client seulement
 * (il lit matchMedia au chargement) ; en cas d'échec, l'image de secours reste affichée.
 */
export const NovaLive = forwardRef<NovaLiveHandle, Props>(function NovaLive({ fallback, label }, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const companionRef = useRef<Companion | null>(null);
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({ setState: (state) => companionRef.current?.setState(state) }), []);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let cancelled = false;
    let inView = false;
    let greeted = false;
    let readyTimer = 0;
    let cleanup = () => {};

    import("../lib/nova/companion.js")
      .then(({ createCompanion }) => {
        if (cancelled) return;
        const companion = createCompanion(canvas);
        companionRef.current = companion;
        companion.setSize("large");
        companion.setMuted(true);
        companion.setPokeable(true);
        companion.pause();

        const sync = () => {
          if (inView && document.visibilityState === "visible") companion.resume();
          else companion.pause();
        };

        const observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          sync();
          if (inView && !greeted) {
            greeted = true;
            companion.emote("happy");
            readyTimer = window.setTimeout(() => setReady(true), BIRTH_MS);
          }
        });
        observer.observe(root);
        document.addEventListener("visibilitychange", sync);

        cleanup = () => {
          observer.disconnect();
          document.removeEventListener("visibilitychange", sync);
          companion.destroy();
          companionRef.current = null;
        };
      })
      .catch(() => {
        // Module indisponible : on garde l'image de secours.
      });

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      cleanup();
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 grid place-items-center">
      <img
        src={fallback}
        alt=""
        aria-hidden="true"
        width={800}
        height={800}
        loading="lazy"
        decoding="async"
        className={`aspect-square w-[34%] object-contain transition-opacity duration-300 max-md:w-[38%] ${ready ? "opacity-0" : "opacity-100"}`}
      />
      <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 h-full w-full" />
    </div>
  );
});
