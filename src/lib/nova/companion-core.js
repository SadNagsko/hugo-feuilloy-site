// Logique pure du personnage (sans dessin) : expression affichée, ressorts, clignements, clics.

/** Expression à afficher : émotion passagère > erreur > sommeil (au repos seulement) > état. */
export function faceFor(state, emote, asleep) {
  if (emote) return emote;
  if (state === "error") return "error";
  if (state === "idle" && asleep) return "sleepy";
  return state ?? "idle";
}

/** Un pas de ressort amorti vers la cible. */
export function spring(x, v, target, k = 0.18, damping = 0.78) {
  v = (v + (target - x) * k) * damping;
  return [x + v, v];
}

/** Délai avant le prochain clignement : 2,2 à 6 s, parfois un double clignement (220 ms). */
export function nextBlink(now, rand = Math.random) {
  return rand() < 0.2 ? 220 : 2200 + rand() * 3800;
}

/** Clic sur Nova : boude, ou étourdie au 3e clic en moins de 1,4 s. */
export function pokeResult(times, now) {
  const recent = [...times.filter((t) => now - t < 1400), now];
  return recent.length >= 3 ? { times: [], emote: "dizzy" } : { times: recent, emote: "annoyed" };
}
