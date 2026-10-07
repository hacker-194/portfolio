"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Phase = "loading" | "exiting" | "ready";

type LoadContextValue = {
  /** True once the intro sequence has finished and the page may animate in. */
  ready: boolean;
  phase: Phase;
  finish: () => void;
  /** Jump straight to the ready state (reduced motion, or returning visitors). */
  skip: () => void;
};

const LoadContext = createContext<LoadContextValue>({
  ready: false,
  phase: "loading",
  finish: () => {},
  skip: () => {},
});

export function LoadProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase("exiting");
    // Give the curtain animation room to play before content animates in.
    window.setTimeout(() => setPhase("ready"), 620);
  }, []);

  const skip = useCallback(() => {
    finished.current = true;
    setPhase("ready");
  }, []);

  const value = useMemo(
    () => ({ ready: phase === "ready", phase, finish, skip }),
    [phase, finish, skip],
  );

  return <LoadContext.Provider value={value}>{children}</LoadContext.Provider>;
}

export function useLoad() {
  return useContext(LoadContext);
}

/**
 * Locks page scrolling while the intro is on screen, honouring the Lenis
 * instance that SmoothScroll registers on `window`.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const lenis = window.__lenis;

    if (locked) {
      root.style.overflow = "hidden";
      lenis?.stop();
    } else {
      root.style.overflow = "";
      lenis?.start();
    }

    return () => {
      root.style.overflow = "";
      lenis?.start();
    };
  }, [locked]);
}
