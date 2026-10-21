export type CompanionState = "idle" | "listening" | "thinking" | "speaking" | "error";
export type CompanionSize = "large" | "small" | "mini";

export type Companion = {
  setState(state: CompanionState): void;
  setLevel(level: number): void;
  setTelemetry(...args: unknown[]): void;
  /** happy, waiting, alert, annoyed, dizzy. waiting et alert restent jusqu'à clearEmote. */
  emote(name: string, ms?: number): void;
  clearEmote(name: string): void;
  setMuted(muted: boolean): void;
  setQuietEvents(quiet: boolean): void;
  onDizzy(callback: () => void): void;
  unlockSound(): void;
  setSize(size: CompanionSize): void;
  setPokeable(pokeable: boolean): void;
  pause(): void;
  resume(): void;
  destroy(): void;
};

export function createCompanion(canvas: HTMLCanvasElement): Companion;
