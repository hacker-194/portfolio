"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { scrollToHash } from "@/components/ScrollSync";
import { useScrollLock } from "@/lib/scroll-lock";
import { useStillMotion } from "@/lib/hooks";
import { PROJECTS } from "@/lib/data";
import { ALL_SECTIONS, PROFILE } from "@/lib/site";
import { EASE_CINEMATIC } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Command palette: press ⌘K (or Ctrl K) or "/" to jump anywhere on the page.
 *
 * It is a real combobox rather than a modal full of buttons: focus stays in the
 * input, the highlighted row is pointed at through `aria-activedescendant`, and
 * the rows carry real `href`s so a middle click still opens the target in a new
 * tab. The dialog is portalled to `document.body` because the bar that hosts the
 * trigger flips its colour tokens while the dark hero is under it, and a palette
 * hanging off that bar would change palette depending on scroll position.
 */

type Command = {
  id: string;
  group: string;
  label: string;
  meta: string;
  href: string;
  /** Section jumps scroll in place; everything else leaves the page. */
  internal: boolean;
  /** Extra text the filter should match on, never shown. */
  keywords?: string;
};

const COMMANDS: Command[] = [
  ...ALL_SECTIONS.map((item) => ({
    id: `section-${item.href}`,
    group: "Sections",
    label: item.label,
    meta: item.index,
    href: item.href,
    internal: true,
  })),
  ...PROJECTS.map((project) => ({
    id: `project-${project.id}`,
    group: "Projects",
    label: project.title,
    meta: project.year,
    href: "#projects",
    internal: true,
    keywords: `${project.category} ${project.stack.join(" ")}`,
  })),
  {
    id: "link-github",
    group: "Links",
    label: "GitHub",
    meta: PROFILE.githubHandle,
    href: PROFILE.github,
    internal: false,
    keywords: "repositories code",
  },
  {
    id: "link-linkedin",
    group: "Links",
    label: "LinkedIn",
    meta: PROFILE.linkedinHandle,
    href: PROFILE.linkedin,
    internal: false,
  },
  {
    id: "link-resume",
    group: "Links",
    label: "Résumé",
    meta: "PDF",
    href: PROFILE.resume,
    internal: false,
    keywords: "cv curriculum vitae",
  },
  {
    id: "link-email",
    group: "Links",
    label: PROFILE.email,
    meta: "Email",
    href: `mailto:${PROFILE.email}`,
    internal: false,
    keywords: "contact mail",
  },
];

const LIST_ID = "command-palette-results";

/** The platform's own modifier hint, read without an effect. */
const subscribeNoop = () => () => {};
const readCombo = () =>
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "Cmd K" : "Ctrl K";
/** What the server writes, so hydration never disagrees with the label. */
const readComboOnServer = () => "Cmd K";

/** The match, marked. Returns plain text when there is nothing to mark. */
function mark(label: string, query: string) {
  const needle = query.trim();
  if (!needle) return label;
  const at = label.toLowerCase().indexOf(needle.toLowerCase());
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <mark className="bg-transparent font-semibold text-accent">
        {label.slice(at, at + needle.length)}
      </mark>
      {label.slice(at + needle.length)}
    </>
  );
}

export function CommandPalette() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const [open, setOpen] = useState(false);
  // Latched once the palette has been opened, so the exit animation has a host
  // to unmount from and the server render never touches the DOM body.
  const [portalled, setPortalled] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  // `useSyncExternalStore` hands the server its own snapshot, then swaps in the
  // real one after hydration, so the shortcut label never mismarks.
  const combo = useSyncExternalStore(
    subscribeNoop,
    readCombo,
    readComboOnServer,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useScrollLock(open);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return COMMANDS;
    return COMMANDS.filter((command) =>
      `${command.label} ${command.group} ${command.meta} ${command.keywords ?? ""}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  // Clamped rather than stored, so filtering can never leave the cursor in the
  // void with nothing selected.
  const activeIndex = results.length
    ? Math.min(cursor, results.length - 1)
    : -1;

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const run = (command: Command) => {
    setOpen(false);
    if (command.internal) {
      window.setTimeout(() => scrollToHash(command.href), 60);
      return;
    }
    if (command.href.startsWith("mailto:") || command.href.startsWith("tel:")) {
      window.location.href = command.href;
      return;
    }
    window.open(command.href, "_blank", "noopener,noreferrer");
  };

  /* Shortcuts. "/" is the copy-paste friendly one, and it has to stay out of
     the way while a form field is being typed in. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        Boolean(target) &&
        (target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          Boolean(target?.isContentEditable));

      if (
        event.key.toLowerCase() === "k" &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setPortalled(true);
        setOpen((current) => {
          if (!current) {
            setQuery("");
            setCursor(0);
          }
          return !current;
        });
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (
        event.key === "/" &&
        !typing &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setPortalled(true);
        setQuery("");
        setCursor(0);
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* Keep the caret on the input whenever the dialog appears. */
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  /* Keep the highlighted row inside the scrolling list. */
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document
      .getElementById(`${LIST_ID}-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
      event.preventDefault();
      if (results.length) setCursor((c) => (c + 1) % results.length);
      return;
    }
    if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      if (results.length)
        setCursor((c) => (c - 1 + results.length) % results.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const command = results[activeIndex];
      if (command) run(command);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  /** A group heading is owed whenever the group differs from the row above. */
  const opensGroup = (index: number) =>
    index === 0 || results[index].group !== results[index - 1].group;

  return (
    <>
      {/* Trigger. Desktop only: on a phone the full-screen menu owns navigation
          and there is no keyboard to open a palette with. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setPortalled(true);
          setQuery("");
          setCursor(0);
          setOpen(true);
        }}
        aria-label={`Open the command palette, shortcut ${combo}`}
        aria-expanded={open}
        className="hidden h-9 items-center gap-2 rounded-[2px] border border-bright/15 px-3 text-muted transition-colors duration-300 hover:border-accent/60 hover:text-bright lg:flex"
      >
        <Search className="h-3.5 w-3.5" strokeWidth={1.8} />
        <span className="font-mono text-xs tracking-[0.14em]">{combo}</span>
      </button>

      {portalled
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  key="command-palette"
                  className="fixed inset-0 z-[90]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.2, ease: EASE_CINEMATIC }}
                >
                  <div
                    className="absolute inset-0 bg-void/88"
                    onClick={close}
                    aria-hidden
                  />

                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Command palette"
                    className="shadow-lift absolute left-1/2 top-[14vh] w-[min(94vw,36rem)] -translate-x-1/2 overflow-hidden rounded-[3px] border border-bright/12 bg-panel"
                  >
                    <div className="flex items-center gap-3 border-b border-bright/15 px-4 py-3.5">
                      <Search
                        className="h-4 w-4 shrink-0 text-muted"
                        strokeWidth={1.8}
                        aria-hidden
                      />
                      <input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setCursor(0);
                        }}
                        onKeyDown={onInputKeyDown}
                        role="combobox"
                        aria-expanded={results.length > 0}
                        aria-controls={LIST_ID}
                        aria-activedescendant={
                          activeIndex >= 0
                            ? `${LIST_ID}-${activeIndex}`
                            : undefined
                        }
                        aria-label="Search sections, projects and links"
                        placeholder="Jump to a section, a project, a link"
                        autoComplete="off"
                        spellCheck={false}
                        className="w-full bg-transparent font-mono text-sm text-bright placeholder:text-muted focus:outline-none"
                      />
                      <span className="label-mono shrink-0 text-muted">esc</span>
                    </div>

                    {results.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-muted">
                        Nothing matches &ldquo;{query.trim()}&rdquo;.
                      </p>
                    ) : (
                      <ul
                        id={LIST_ID}
                        role="listbox"
                        aria-label="Results"
                        className="max-h-[52vh] overflow-y-auto p-2"
                      >
                        {results.map((command, index) => {
                          const showGroup = opensGroup(index);
                          const active = index === activeIndex;
                          return (
                            <li
                              key={command.id}
                              role="presentation"
                              className={cn(!showGroup && "mt-1")}
                            >
                              {showGroup ? (
                                <span className="label-mono block px-3 pb-1.5 pt-3 text-muted">
                                  {command.group}
                                </span>
                              ) : null}
                              <a
                                id={`${LIST_ID}-${index}`}
                                href={command.href}
                                role="option"
                                aria-selected={active}
                                tabIndex={-1}
                                onMouseMove={() => setCursor(index)}
                                onClick={(event) => {
                                  event.preventDefault();
                                  run(command);
                                }}
                                className={cn(
                                  "flex items-baseline gap-3 rounded-[2px] px-3 py-2.5 transition-colors duration-150",
                                  active
                                    ? "bg-accent text-void"
                                    : "text-soft hover:bg-bright/5",
                                )}
                              >
                                <span
                                  className={cn(
                                    "w-8 shrink-0 font-mono text-xs tabular-nums",
                                    active ? "text-void/70" : "text-muted",
                                  )}
                                >
                                  {command.meta}
                                </span>
                                <span className="truncate text-sm">
                                  {mark(command.label, query)}
                                </span>
                                {active ? (
                                  <span
                                    className="ml-auto shrink-0 font-mono text-xs text-void/70"
                                    aria-hidden
                                  >
                                    enter
                                  </span>
                                ) : null}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <div className="flex items-center justify-between border-t border-bright/15 px-4 py-2.5">
                      <span className="label-mono text-muted">
                        up down move, enter open
                      </span>
                      <span className="label-mono text-muted">
                        {results.length} of {COMMANDS.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

export default CommandPalette;
