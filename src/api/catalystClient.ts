

declare global {
  interface Window {
    catalyst: any;
  }
}

export function getCatalyst() {
  if (!window.catalyst) {
    throw new Error("Catalyst SDK not loaded");
  }
  return window.catalyst;
}