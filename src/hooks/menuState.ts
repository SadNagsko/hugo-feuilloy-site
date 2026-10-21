import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

export function setMenuOpen(value: boolean) {
  if (open === value) return;
  open = value;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useMenuOpen() {
  return useSyncExternalStore(subscribe, () => open, () => false);
}
