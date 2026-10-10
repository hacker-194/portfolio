import type Lenis from "lenis";

declare global {
  interface Window {
    /** The active Lenis instance, shared so any component can drive scrolling. */
    __lenis?: Lenis;
  }
}

export {};
