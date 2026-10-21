// Nova, le galet : un galet de gelée brillante (dégradé bleu → violet → magenta) avec deux yeux.
// Calme quand Hugo travaille (respire, cligne, suit la souris), expressive quand il se passe quelque chose.
// Même API que l'ancienne orbe : setState, setLevel, emote, clearEmote, setMuted, onDizzy, unlockSound, + setSize, setQuietEvents.
import { faceFor, nextBlink, pokeResult, spring } from "./companion-core.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDark = () => document.documentElement.dataset.theme !== "light";

// Forme du galet (croquis A), centrée sur 0,0 et ramenée à une demi-largeur de 1
const BODY = new Path2D();
{
  const pts = [[60, 150], [52, 102, 92, 70, 150, 70], [214, 70, 256, 98, 250, 148], [244, 200, 204, 226, 150, 226], [96, 226, 66, 196, 60, 150]];
  const X = (x) => (x - 154) / 102, Y = (y) => (y - 148) / 102;
  BODY.moveTo(X(pts[0][0]), Y(pts[0][1]));
  for (const [a, b, c, d, e, f] of pts.slice(1)) BODY.bezierCurveTo(X(a), Y(b), X(c), Y(d), X(e), Y(f));
  BODY.closePath();
}
const HALF_H = 0.765; // demi-hauteur du galet (unités du tracé)

// ---- petits sons synthétisés (aucun fichier) ----
let actx = null;
function tone(seq, type = "sine", vol = 0.06) {
  if (!actx) return;
  const now = actx.currentTime;
  for (const [f0, f1, at, dur] of seq) {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, now + at);
    o.frequency.exponentialRampToValueAtTime(f1, now + at + dur);
    g.gain.setValueAtTime(0.0001, now + at);
    g.gain.exponentialRampToValueAtTime(vol, now + at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + at + dur);
    o.connect(g).connect(actx.destination);
    o.start(now + at);
    o.stop(now + at + dur + 0.02);
  }
}
const SOUNDS = {
  wake: () => tone([[420, 760, 0, 0.16]], "sine", 0.045),
  happy: () => tone([[660, 660, 0, 0.12], [990, 990, 0.1, 0.18]], "triangle", 0.05),
  waiting: () => tone([[620, 820, 0, 0.12], [820, 620, 0.14, 0.12]], "sine", 0.045),
  alert: () => tone([[880, 880, 0, 0.08], [1320, 1320, 0.11, 0.1]], "sine", 0.05),
  annoyed: () => tone([[560, 380, 0, 0.09]], "sine", 0.07),
  dizzy: () => tone([[700, 220, 0, 0.55]], "triangle", 0.05),
};
const EVENT_SOUNDS = new Set(["happy", "waiting", "alert"]);
const SIZES = { large: { r: 0.3, motion: 1 }, small: { r: 0.34, motion: 0.8 }, mini: { r: 0.4, motion: 0.55 } };

export function createCompanion(canvas) {
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1;
  let state = "idle", level = 0, target = 0;
  let size = SIZES.large;
  let muted = false, quietEvents = false, onDizzy = () => {};
  const emo = { name: null, until: 0 };
  const sticky = new Set(); // waiting / alert : jusqu'à clearEmote
  let gx = 0, gy = 0, tgx = 0, tgy = 0;
  let lastPointer = 0, lastActive = performance.now(), nextSaccade = 0, asleep = false;
  let blinkAt = performance.now() + 2500;
  let sx = 1, vsx = 0, sy = 1, vsy = 0, jy = 0, vjy = 0, tilt = 0, vtilt = 0;
  let pokes = [];
  let pokeable = true;
  let born = reduced ? 1 : 0;
  let paused = false, raf = 0;

  const play = (k) => {
    if (muted || (quietEvents && EVENT_SOUNDS.has(k))) return;
    SOUNDS[k]?.();
  };
  const kick = (dy = 0, dsx = 0, dsy = 0) => {
    if (reduced) return;
    vjy += dy;
    vsx += dsx;
    vsy += dsy;
  };
  const setEmote = (name, ms) => {
    emo.name = name;
    emo.until = ms ? performance.now() + ms : Infinity;
  };
  const wake = () => {
    lastActive = performance.now();
    if (asleep) {
      asleep = false;
      kick(-0.25);
      play("wake");
    }
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  const onPointerMove = (e) => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const k = Math.max(r.width, r.height) * 0.9;
    tgx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / k));
    tgy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / k));
    lastPointer = performance.now();
    wake();
  };
  addEventListener("pointermove", onPointerMove, { passive: true });

  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || !pokeable) return;
    const r = canvas.getBoundingClientRect();
    const R = Math.min(r.width, r.height) * size.r;
    const dx = (e.clientX - (r.left + r.width / 2)) / R, dy = (e.clientY - (r.top + r.height / 2)) / R;
    if (dx * dx + (dy / HALF_H) ** 2 > 1.3) return; // clic hors du galet
    try { actx ??= new (window.AudioContext || window.webkitAudioContext)(); } catch {}
    wake();
    const res = pokeResult(pokes, performance.now());
    pokes = res.times;
    kick(0, 0.16, -0.2); // écrasée
    if (res.emote === "dizzy") {
      setEmote("dizzy", 3000);
      play("dizzy");
      onDizzy();
    } else if (emo.name !== "dizzy") {
      setEmote("annoyed", 800);
      play("annoyed");
    }
  });

  function frame() {
    raf = 0;
    if (paused) return;
    const now = performance.now();
    if (emo.name && now > emo.until) emo.name = null;
    const current = emo.name ?? (sticky.has("waiting") ? "waiting" : sticky.has("alert") ? "alert" : null);
    if (state !== "idle" || current) lastActive = now;
    if (state === "idle" && !current && now - lastActive > 180_000) asleep = true;
    const face = faceFor(state, current, asleep);
    level += (target - level) * 0.2;
    if (born < 1) born = Math.min(1, born + 1 / 40);

    // ---- mouvements du corps ----
    const M = reduced ? 0 : size.motion;
    let tiltTarget = gx * 0.06, syTarget = 1, sxTarget = 1;
    if (face === "sleepy" || face === "error") (syTarget = 0.95), (sxTarget = 1.03);
    if (face === "thinking") tiltTarget += Math.sin(now / 170) * 0.035;
    if (face === "dizzy") tiltTarget = Math.sin(now / 120) * 0.14;
    if ((face === "speaking" || face === "listening") && M) vjy -= level * 0.035;
    if (face === "waiting" && M && Math.sin(now / 300) > 0.985) vjy -= 0.03;
    const shake = face === "alert" && M ? Math.sin(now / 45) * 0.02 * (Math.sin(now / 600) > 0.4 ? 1 : 0) : 0;
    [sx, vsx] = spring(sx, vsx, sxTarget);
    [sy, vsy] = spring(sy, vsy, syTarget);
    [jy, vjy] = spring(jy, vjy, 0, 0.12, 0.84);
    [tilt, vtilt] = spring(tilt, vtilt, tiltTarget * M, 0.1, 0.8);

    // ---- regard ----
    let ax = tgx, ay = tgy;
    if (face === "thinking") (ax = 0.6), (ay = -0.6);
    else if (face === "sleepy") (ax = 0), (ay = 0.3);
    else if (now - lastPointer > 4000 && now > nextSaccade) {
      tgx = (Math.random() - 0.5) * 0.9;
      tgy = (Math.random() - 0.5) * 0.5;
      nextSaccade = now + 1400 + Math.random() * 2600;
    }
    const ease = reduced ? 1 : 0.14;
    gx += (ax - gx) * ease;
    gy += (ay - gy) * ease;

    // ---- clignements ----
    if (now > blinkAt) blinkAt = now + nextBlink(now);
    const dt = blinkAt - now;
    const blink = dt > 0 && dt < 130 ? Math.max(0.08, dt / 130) : 1;
    const breathe = reduced ? 1 : 1 + 0.03 * Math.sin(now / 950);

    draw(now, face, blink, breathe, shake);
    raf = requestAnimationFrame(frame);
  }

  function draw(now, face, blink, breathe, shake) {
    const dark = isDark();
    const R = Math.min(w, h) * size.r * (0.6 + 0.4 * born);
    const cx = w / 2 + shake * R, cy = h / 2 + R * 0.05;
    ctx.clearRect(0, 0, w, h);
    if (R < 2) return;
    const lift = jy * R; // < 0 quand elle saute

    // halo
    const halo = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, Math.min(R * 1.9, Math.min(w, h) / 2)); // jamais coupé par le bord
    halo.addColorStop(0, dark ? "rgba(139,99,242,0.38)" : "rgba(139,99,242,0.16)");
    halo.addColorStop(1, "rgba(139,99,242,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    // ombre au sol (plus petite quand elle saute)
    const shadowK = Math.max(0.4, 1 + jy * 1.5);
    ctx.fillStyle = dark ? "rgba(139,99,242,0.32)" : "rgba(60,30,130,0.16)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + R * (HALF_H + 0.18), R * 0.7 * shadowK, R * 0.08 * shadowK, 0, 0, Math.PI * 2);
    ctx.filter = "blur(6px)";
    ctx.fill();
    ctx.filter = "none";

    // corps
    ctx.save();
    ctx.translate(cx, cy + lift + R * HALF_H * (1 - sy * breathe)); // s'écrase vers le sol
    ctx.rotate(tilt);
    ctx.scale(R * sx * (2 - breathe), R * sy * breathe);
    const body = ctx.createLinearGradient(-1, -HALF_H, 1, HALF_H);
    body.addColorStop(0, "#5AA8FF");
    body.addColorStop(0.5, "#8B63F2");
    body.addColorStop(1, "#F05AD6");
    ctx.fillStyle = body;
    ctx.fill(BODY);
    const shade = ctx.createRadialGradient(0.35, 0.45, 0.1, 0.35, 0.45, 1.3);
    shade.addColorStop(0, "rgba(30,8,80,0)");
    shade.addColorStop(1, "rgba(30,8,80,0.28)");
    ctx.fillStyle = shade;
    ctx.fill(BODY);
    const shine = ctx.createRadialGradient(-0.35, -0.42, 0, -0.35, -0.42, 0.95);
    shine.addColorStop(0, "rgba(255,255,255,0.55)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.fill(BODY);
    ctx.lineWidth = 0.018;
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.stroke(BODY);

    drawFace(now, face, blink, breathe);
    ctx.restore();
  }

  // Le visage est dessiné dans le repère du galet (demi-largeur = 1)
  function drawFace(now, face, blink, breathe) {
    const INK = "#1A0F3A";
    const ex = gx * 0.18, ey = -0.08 + gy * 0.12;
    const eyes = [-1, 1].map((side) => ({ x: side * 0.33 + ex, y: ey, side }));
    const W = 0.137, H = 0.255;
    const lw = 0.06;
    ctx.fillStyle = INK;
    ctx.strokeStyle = INK;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lw;
    // le texte se dessine à une échelle normale (les polices de moins d'1 px s'affichent mal)
    const label = (str, x, y, sz) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(0.01, 0.01);
      ctx.font = `800 ${sz * 100}px Manrope, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(str, 0, 0);
      ctx.restore();
    };
    const pill = (x, y, ww, hh, glint = true) => {
      ctx.beginPath();
      ctx.roundRect(x - ww / 2, y - hh / 2, ww, hh, Math.min(ww, hh) / 2);
      ctx.fill();
      if (glint && hh > ww * 0.9) {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(x + ww * 0.15, y - hh * 0.22, ww * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = INK;
      }
    };

    for (const e of eyes) {
      const { x, y, side } = e;
      switch (face) {
        case "happy":
          ctx.beginPath();
          ctx.arc(x, y + H * 0.2, W * 0.75, Math.PI * 1.12, Math.PI * 1.88);
          ctx.stroke();
          break;
        case "annoyed":
          ctx.beginPath();
          ctx.moveTo(x + side * W * 0.6, y - H * 0.3);
          ctx.lineTo(x - side * W * 0.55, y);
          ctx.lineTo(x + side * W * 0.6, y + H * 0.3);
          ctx.stroke();
          break;
        case "error":
          ctx.beginPath();
          ctx.moveTo(x - W * 0.55, y - H * 0.25); ctx.lineTo(x + W * 0.55, y + H * 0.25);
          ctx.moveTo(x + W * 0.55, y - H * 0.25); ctx.lineTo(x - W * 0.55, y + H * 0.25);
          ctx.stroke();
          break;
        case "dizzy": {
          ctx.beginPath();
          const rot = (now / 160) * side;
          for (let a = 0; a <= 4.4 * Math.PI; a += 0.2) {
            const rr = (a / (4.4 * Math.PI)) * W * 0.95;
            const px = x + Math.cos(a + rot) * rr, py = y + Math.sin(a + rot) * rr;
            a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.lineWidth = lw * 0.7;
          ctx.stroke();
          ctx.lineWidth = lw;
          break;
        }
        case "sleepy":
          pill(x, y + H * 0.22, W * 1.1, lw * 0.9, false);
          break;
        case "thinking": // paupière mi-close : on garde le bas de l'œil
          ctx.save();
          ctx.beginPath();
          ctx.rect(x - W, y - H * 0.05, W * 2, H);
          ctx.clip();
          pill(x, y, W, H * blink, false);
          ctx.restore();
          break;
        case "waiting":
        case "alert":
          pill(x, y, W * 1.35, W * 1.35 * Math.max(blink, 0.15));
          break;
        case "listening":
          pill(x, y, W * 1.12, H * 1.12 * blink * breathe);
          break;
        default:
          pill(x, y, W, H * blink * breathe);
      }
    }

    // bouche
    const mx = ex, my = ey + 0.3;
    if (face === "speaking") {
      pill(mx, my, 0.16, Math.max(lw * 0.8, 0.16 * Math.min(1, level * 1.6)), false);
    } else if (face === "happy") {
      ctx.beginPath();
      ctx.arc(mx, my - 0.06, 0.1, Math.PI * 0.15, Math.PI * 0.85);
      ctx.lineWidth = lw * 0.8;
      ctx.stroke();
      ctx.lineWidth = lw;
    } else if (face === "annoyed" || face === "dizzy") {
      ctx.beginPath();
      ctx.moveTo(mx - 0.08, my);
      for (let k = 1; k <= 4; k++) ctx.lineTo(mx - 0.08 + (k * 0.16) / 4, my + (k % 2 ? -1 : 1) * 0.025);
      ctx.lineWidth = lw * 0.6;
      ctx.stroke();
      ctx.lineWidth = lw;
    }

    // joues
    if (face === "happy" || face === "dizzy") {
      for (const e of eyes) {
        const g = ctx.createRadialGradient(e.x + e.side * 0.06, e.y + 0.2, 0, e.x + e.side * 0.06, e.y + 0.2, 0.13);
        g.addColorStop(0, "rgba(255,127,200,0.75)");
        g.addColorStop(1, "rgba(255,127,200,0)");
        ctx.fillStyle = g;
        ctx.fillRect(e.x - 0.25, e.y, 0.5, 0.4);
      }
    }

    // bulles « ? » / « ! »
    if (face === "waiting" || face === "alert") {
      const bx = 0.82, by = -0.78, br = 0.2;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = face === "alert" ? "#F05AD6" : "#8B63F2";
      label(face === "alert" ? "!" : "?", bx, by + br * 0.08, br * 1.5);
    }

    // « z » du sommeil
    if (face === "sleepy" && !reduced) {
      ctx.fillStyle = isDark() ? "rgba(235,228,255,0.85)" : "rgba(60,30,130,0.7)";
      for (let k = 0; k < 3; k++) {
        const ph = (now / 1700 + k / 3) % 1;
        ctx.globalAlpha = Math.sin(ph * Math.PI);
        label("z", 0.7 + ph * 0.35, -0.75 - ph * 0.5, 0.16 + k * 0.05);
      }
      ctx.globalAlpha = 1;
    }
  }

  raf = requestAnimationFrame(frame);

  return {
    /** Arrête la boucle de dessin (carte hors écran, onglet caché). */
    pause: () => {
      paused = true;
      cancelAnimationFrame(raf);
      raf = 0;
    },
    resume: () => {
      paused = false;
      if (!raf) raf = requestAnimationFrame(frame);
    },
    destroy: () => {
      paused = true;
      cancelAnimationFrame(raf);
      raf = 0;
      removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
    },
    setState: (s) => {
      if (s !== state) wake();
      state = s;
    },
    setLevel: (v) => (target = Math.max(0, Math.min(1, v))),
    setTelemetry: () => {},
    /** Émotion : happy, waiting, alert, annoyed, dizzy. waiting et alert restent jusqu'à clearEmote. */
    emote: (name, ms) => {
      wake();
      if (name === "waiting" || name === "alert") {
        if (!sticky.has(name)) {
          play(name);
          kick(-0.1);
        }
        sticky.add(name);
        return;
      }
      if (name === "happy") {
        play("happy");
        kick(-0.24, -0.05, 0.08);
      }
      if (name === "dizzy") play("dizzy");
      setEmote(name, ms ?? 1800);
    },
    clearEmote: (name) => {
      sticky.delete(name);
      if (emo.name === name) emo.name = null;
    },
    setMuted: (m) => (muted = m),
    /** true : pas de sons d'événements (l'encoche du Mac s'en charge) */
    setQuietEvents: (q) => (quietEvents = q),
    onDizzy: (fn) => (onDizzy = fn),
    unlockSound: () => {
      try {
        actx ??= new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === "suspended") actx.resume().catch(() => {});
      } catch {}
    },
    setSize: (s) => (size = SIZES[s] ?? SIZES.large),
    /** false : un clic sur Nova ne la fait pas bouder (dans l'encoche, un clic ouvre la conversation) */
    setPokeable: (p) => (pokeable = p),
  };
}
