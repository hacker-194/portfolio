"use client";

import { useEffect, useRef } from "react";
import { PALETTE as C, tint } from "@/lib/palette";
import { prefersReducedMotion } from "@/lib/gsap";
import { SKILL_GROUPS } from "@/lib/data";
import {
  DOMAIN_ORDER,
  SKILL_LINKS,
  SKILL_NODES,
  UNIVERSE_EXTENT,
  evidenceFor,
  nodeScale,
  placementOf,
} from "@/lib/skill-universe";
import { clamp } from "@/lib/utils";

/**
 * The skill universe, drawn in three dimensions.
 *
 * The same small software renderer the hero uses: nothing here is a scene graph
 * and nothing is a 3D library. Twenty-six nodes are rotated, projected, fogged
 * and composited from pre-rendered sprites, and the links between them are
 * stroked in three passes. That is the whole engine, and it costs no dependency.
 *
 * What is different from the hero is that this figure is a control. The pointer
 * can turn it, and a node can be selected, which is why this component reports
 * hover and selection through props instead of being decorative. The panel
 * beside it is the accessible path to the same nodes.
 *
 * Node size is not a proficiency score. It is `nodeScale(count)`, where `count`
 * is how many entries across the CV record that skill, and the panel lists every
 * one of those entries. A thing that is recorded more often is drawn larger.
 */

const TAU = Math.PI * 2;

/** Pointer travel under this many pixels is a tap, not a drag. */
const TAP_SLOP = 8;

/** Turn per pixel dragged. */
const DRAG_SENSITIVITY = 0.0055;

/** Pitch stops short of the poles, so the figure never reads as a flat sheet. */
const PITCH_LIMIT = 1.05;

/** Radians per millisecond of the idle drift, about two degrees a second. */
const DRIFT = 0.000035;

/** Idle time before the figure starts drifting again. */
const IDLE_BEFORE_DRIFT = 2600;

const NODES = SKILL_NODES.map((node) => {
  const placement = placementOf(node.id);
  return {
    node,
    x: placement?.x ?? 0,
    y: placement?.y ?? 0,
    z: placement?.z ?? 0,
    scale: nodeScale(evidenceFor(node).count),
  };
});

const INDEX = new Map(NODES.map((entry, index) => [entry.node.id, index]));

const LINKS = SKILL_LINKS.map(([a, b]) => ({
  a: INDEX.get(a) ?? 0,
  b: INDEX.get(b) ?? 0,
}));

/**
 * One anchor per domain, at the mean of its own nodes, so the cluster titles
 * label the real figure rather than a second hard-coded layout.
 */
const DOMAINS = DOMAIN_ORDER.map((id) => {
  const members = NODES.filter((entry) => entry.node.domain === id);
  const home = { x: 0, y: 0, z: 0 };
  for (const entry of members) {
    home.x += entry.x;
    home.y += entry.y;
    home.z += entry.z;
  }
  const count = Math.max(1, members.length);

  return {
    id,
    title: SKILL_GROUPS.find((entry) => entry.id === id)?.title ?? id,
    x: home.x / count,
    y: home.y / count,
    z: home.z / count,
  };
});

type Projected = {
  x: number;
  y: number;
  z: number;
  r: number;
  fog: number;
};

/** A soft radial sprite, rendered once and reused for every node. */
function makeSprite(stops: [number, string][], size = 96) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  for (const [at, color] of stops) gradient.addColorStop(at, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

export type SkillUniverseCanvasProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  /** Describes the figure for assistive tech; the panel carries the data. */
  label: string;
};

export function SkillUniverseCanvas({
  selectedId,
  onSelect,
  className,
  label,
}: SkillUniverseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selectedRef = useRef<string | null>(selectedId);
  const selectRef = useRef(onSelect);
  /** Set by the renderer, so a selection can turn the figure from outside it. */
  const aimRef = useRef<((id: string | null) => void) | null>(null);

  // Both kept in refs so a new selection or a new callback never tears down the
  // renderer, and written in an effect rather than during render.
  useEffect(() => {
    selectRef.current = onSelect;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const still = prefersReducedMotion();
    const family = getComputedStyle(canvas).fontFamily || "monospace";

    const nodeSprite = makeSprite([
      [0, C.bright],
      [0.16, C.ice],
      [0.36, tint("volt", 0.66)],
      [0.66, tint("accent", 0.22)],
      [1, "rgba(0,0,0,0)"],
    ]);
    // Selected and hovered nodes get a wider halo, so the one being read finds
    // the eye before its label does.
    const halo = makeSprite([
      [0, tint("ice", 0.5)],
      [0.18, tint("volt", 0.3)],
      [0.55, tint("accent", 0.12)],
      [1, "rgba(0,0,0,0)"],
    ]);
    const anchorSprite = makeSprite([
      [0, tint("accent", 0.3)],
      [0.45, tint("accent", 0.1)],
      [1, "rgba(0,0,0,0)"],
    ]);

    let width = 0;
    let height = 0;
    let fit = 0.3;
    let unit = 1;
    let sparse = false;

    let yaw = 0.6;
    let pitch = -0.22;
    let aimYaw = yaw;
    let aimPitch = pitch;
    let spin = 0;
    let lastInteraction = 0;
    let dragging = false;
    let dragged = 0;
    let pointerX = Number.NaN;
    let pointerY = Number.NaN;
    let inside = false;
    let hover = -1;
    let frame = 0;
    let running = true;
    let lastFrame = 0;

    const projected: Projected[] = NODES.map(() => ({ x: 0, y: 0, z: 0, r: 0, fog: 0 }));
    const order: number[] = NODES.map((_, index) => index);
    /**
     * Label boxes drawn this frame, as flat x0,y0,x1,y1.
     *
     * Cleared at the top of every label pass. It was not, and the effect was
     * two-sided: each label collided with its own box from the previous frame
     * and stopped drawing after the first, and the array grew for as long as the
     * section stayed on screen.
     */
    const boxes: number[] = [];
    /** Label widths, keyed by size and text: measuring is the one text call
     *  worth caching, and the size is quantised to give the cache a chance. */
    const widths = new Map<string, number>();

    const eye = UNIVERSE_EXTENT * 5;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(width * dpr));
      const h = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      unit = Math.min(width, height) / 560;
      // Only a phone is too narrow for labels. Anything wider draws what fits:
      // the collision pass drops the ones that would pile up, which handles a
      // small laptop without giving up the whole spread the way this did.
      sparse = width < 430;
      // The figure is framed so its furthest node sits inside 42% of the
      // smaller side, which leaves room for labels on the wide axis.
      fit = (Math.min(width, height) * (sparse ? 0.45 : 0.42)) / UNIVERSE_EXTENT;
      widths.clear();
    };

    /** Rotates and projects every node into `projected`. */
    const project = () => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const cx = width * 0.5;
      const cyScreen = height * 0.5;

      for (let i = 0; i < NODES.length; i += 1) {
        const node = NODES[i];
        const rx = node.x * cy + node.z * sy;
        const rz = -node.x * sy + node.z * cy;
        const ry = node.y * cp - rz * sp;
        const depth = node.y * sp + rz * cp;

        // A gentle perspective: enough that near nodes read as near, and only
        // ever magnifying nodes that sit towards the middle of the screen,
        // where there is room for it.
        const near = eye / (eye - depth);
        const out = projected[i];
        out.x = cx + rx * fit * near;
        out.y = cyScreen + ry * fit * near;
        out.z = depth;
        out.r = node.scale * 6.4 * unit * near;
        out.fog = 1 - clamp((depth + UNIVERSE_EXTENT) / (UNIVERSE_EXTENT * 2), 0, 1);
      }
    };

    /** The node under the pointer, or -1. Front to back, so the nearest wins. */
    const pick = () => {
      if (!inside || Number.isNaN(pointerX)) return -1;
      for (let o = order.length - 1; o >= 0; o -= 1) {
        const index = order[o];
        const p = projected[index];
        if (p.fog < 0.14) continue;
        // Forgiving on purpose: nodes overlap on screen, and the nearest one
        // wins the tie, so a generous reach costs nothing and makes a small
        // sphere easy to hit.
        const reach = p.r * 2 + 9;
        if (Math.hypot(pointerX - p.x, pointerY - p.y) <= reach) return index;
      }
      return -1;
    };

    const drawLabel = (
      text: string,
      x: number,
      y: number,
      size: number,
      alpha: number,
      colour: string,
      align: "left" | "right",
      /** Priority labels always draw; the rest give way to what is already there. */
      priority: boolean,
    ) => {
      // Legibility floor: the figure scales down with its canvas, but the
      // text must not follow it below 12px on a phone.
      const px = Math.max(size, 12);
      const key = `${px}|${text}`;
      let w = widths.get(key);
      if (w === undefined) {
        ctx.font = `${px}px ${family}`;
        w = ctx.measureText(text).width;
        widths.set(key, w);
      }

      const boxW = w + 10;
      const x0 = align === "left" ? x - 2 : x - boxW;
      const y0 = y - px * 1.4;
      const x1 = x0 + boxW;
      const y1 = y + px * 0.7;

      if (!priority) {
        for (let b = 0; b < boxes.length; b += 4) {
          if (x0 < boxes[b + 2] && x1 > boxes[b] && y0 < boxes[b + 3] && y1 > boxes[b + 1]) {
            return;
          }
        }
      }
      boxes.push(x0, y0, x1, y1);

      ctx.font = `${px}px ${family}`;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colour;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = align;
      ctx.fillText(text, x, y);
      ctx.globalAlpha = 1;
    };

    const render = (time: number) => {
      project();
      const next = pick();
      if (next !== hover) hover = next;

      const selected = selectedRef.current;
      const focus =
        hover >= 0 ? hover : selected ? (INDEX.get(selected) ?? -1) : -1;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      /* Links, in two passes rather than one stroke per connection: the chosen
         node's own connections, then every other one faintly. */
      for (const pass of [
        { alpha: focus >= 0 ? 0.44 : 0.2, width: 1, bucket: 0 },
        { alpha: focus >= 0 ? 0.05 : 0.13, width: 0.6, bucket: 1 },
      ]) {
        ctx.strokeStyle = tint(pass.bucket === 0 ? "volt" : "accent", pass.alpha);
        ctx.lineWidth = pass.width;
        ctx.beginPath();
        for (const link of LINKS) {
          const lit = focus >= 0 && (link.a === focus || link.b === focus);
          if ((pass.bucket === 0) !== lit) continue;
          const a = projected[link.a];
          const b = projected[link.b];
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
      }

      /* Every label this frame starts from an empty table. Cluster names are
         drawn first and reserve their room, then the node labels take what is
         left, so the two never land on each other. */
      boxes.length = 0;

      for (const domain of DOMAINS) {
        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        const cp = Math.cos(pitch);
        const sp = Math.sin(pitch);
        const rz = -domain.x * sy + domain.z * cy;
        const depth = domain.y * sp + rz * cp;
        const near = eye / (eye - depth);
        const x = width * 0.5 + (domain.x * cy + domain.z * sy) * fit * near;
        const y = height * 0.5 + (domain.y * cp - rz * sp) * fit * near;

        ctx.globalAlpha = 0.16 * clamp((depth + UNIVERSE_EXTENT) / UNIVERSE_EXTENT, 0, 1);
        ctx.drawImage(anchorSprite, x - 46 * unit, y - 46 * unit, 92 * unit, 92 * unit);
        ctx.globalAlpha = 1;

        drawLabel(
          domain.title.toUpperCase(),
          x - 74 * unit,
          y - 20 * unit,
          7.5 * unit,
          0.42,
          C.muted,
          "left",
          // Yielding: once the labels wear the 12px floor, six cluster tags
          // can crowd a small canvas, and the collision pass drops the ones
          // that would pile up instead of stacking them.
          false,
        );
      }

      /* Nodes, far to near, one sprite each. The one being pointed at or read is
         drawn last so a nearer sphere can never sit over it: on a figure this
         dense, the node you aimed at has to be the node you can see. */
      order.sort((a, b) => projected[b].z - projected[a].z);
      if (focus >= 0) {
        const at = order.indexOf(focus);
        if (at >= 0 && at < order.length - 1) {
          order.splice(at, 1);
          order.push(focus);
        }
      }

      for (const index of order) {
        const entry = NODES[index];
        const p = projected[index];
        const r = p.r * 2.7;
        const lit = index === focus ? 1 : 0;
        const alpha = clamp(p.fog * (0.3 + 0.7 * p.fog) + lit * 0.5, 0, 1);

        if (index === focus) {
          const haloRadius = r * (selected === entry.node.id ? 2.1 : 1.65);
          ctx.globalAlpha = 0.5;
          ctx.drawImage(halo, p.x - haloRadius, p.y - haloRadius, haloRadius * 2, haloRadius * 2);
        }

        ctx.globalAlpha = alpha;
        ctx.drawImage(nodeSprite, p.x - r, p.y - r, r * 2, r * 2);
        ctx.globalAlpha = 1;
      }

      /* The selection ring, and the pulse that says it is a live state. */
      if (selected) {
        const index = INDEX.get(selected);
        if (index !== undefined) {
          const p = projected[index];
          // Reduced motion holds one still frame, so the ring has one radius
          // rather than a pulse it never gets to show.
          const pulse = still ? 0 : Math.sin(time * 0.0016) * 0.14;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (2.6 + pulse), 0, TAU);
          ctx.strokeStyle = tint("ice", 0.5);
          ctx.lineWidth = 0.9;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (3.6 + pulse * 1.6), 0, TAU);
          ctx.strokeStyle = tint("accent", 0.22);
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      /* Labels on top of everything, front to back so the near ones win. */
      for (let o = order.length - 1; o >= 0; o -= 1) {
        const index = order[o];
        const entry = NODES[index];
        const p = projected[index];
        const isFocus = index === focus;
        const isSelected = selected === entry.node.id;

        // A small canvas cannot carry twenty-six labels, so it carries only the
        // one being read. The panel below lists the rest as text.
        if (sparse && !isFocus && !isSelected) continue;
        if (!isFocus && p.fog < 0.3) continue;

        const align: "left" | "right" = p.x > width * 0.68 ? "right" : "left";
        const gap = p.r * 2.4 + 7;
        drawLabel(
          entry.node.label,
          align === "left" ? p.x + gap : p.x - gap,
          p.y + p.r * 0.6,
          (isFocus || isSelected ? 12 : 10.5) * unit,
          isFocus || isSelected ? 0.96 : 0.34 + p.fog * 0.5,
          isSelected ? C.bright : isFocus ? C.ice : C.soft,
          align,
          !isFocus && !isSelected,
        );
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const step = (time: number) => {
      if (!running) return;
      const delta = lastFrame === 0 ? 16 : Math.min(48, time - lastFrame);
      lastFrame = time;

      // Idle drift, paused while the reader is turning it and while a node is
      // selected: the figure holds still to be read.
      const idle = time - lastInteraction > IDLE_BEFORE_DRIFT;
      if (!dragging && !still && idle && !selectedRef.current) aimYaw += DRIFT * delta;

      // A released drag keeps a little of its own momentum: about one drag's
      // worth of turn spread over a third of a second, then nothing.
      if (!dragging && Math.abs(spin) > 0.00002) {
        aimYaw += spin * (delta / 16);
        spin *= 0.9;
      }

      yaw += (aimYaw - yaw) * 0.075;
      pitch += (aimPitch - pitch) * 0.075;

      render(time);
      frame = requestAnimationFrame(step);
    };

    const stillFrame = () => render(1200);

    const requestRender = () => {
      if (still) stillFrame();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      dragging = true;
      dragged = 0;
      spin = 0;
      lastInteraction = event.timeStamp;
      pointerX = event.offsetX;
      pointerY = event.offsetY;
      inside = true;
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.offsetX;
      pointerY = event.offsetY;
      inside = true;

      if (!dragging) {
        // Hover is resolved against the current projection inside the frame,
        // so nothing needs to happen here beyond remembering the position.
        requestRender();
        return;
      }

      const dx = event.movementX;
      const dy = event.movementY;
      dragged += Math.abs(dx) + Math.abs(dy);
      aimYaw += dx * DRAG_SENSITIVITY;
      aimPitch = clamp(aimPitch + dy * DRAG_SENSITIVITY, -PITCH_LIMIT, PITCH_LIMIT);
      // Carried as one frame's worth of turn, not a velocity: the decay in
      // `step` then adds a short glide rather than a spin. Scaled any larger,
      // a flick keeps turning for hundreds of degrees.
      spin = dx * DRAG_SENSITIVITY;
      lastInteraction = event.timeStamp;
      if (still) {
        yaw = aimYaw;
        pitch = aimPitch;
        stillFrame();
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      lastInteraction = event.timeStamp;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      if (dragged > TAP_SLOP) return;
      // A tap is a selection, so it must not leave the figure gliding.
      spin = 0;

      pointerX = event.offsetX;
      pointerY = event.offsetY;
      const index = pick();
      if (index >= 0) selectRef.current(NODES[index].node.id);
      else requestRender();
    };

    const onPointerLeave = () => {
      inside = false;
      pointerX = Number.NaN;
      if (!dragging) requestRender();
    };

    const onResize = () => {
      resize();
      if (still) stillFrame();
    };

    resize();

    /* Turns the whole figure so the selected node faces the reader. */
    const aimAt = (id: string | null) => {
      if (!id) return;
      const index = INDEX.get(id);
      if (index === undefined) return;
      const node = NODES[index];
      const radius = Math.hypot(node.x, node.z);

      // Solved from the same rotation `project` applies: this yaw puts the node
      // at the middle of the frame with its near side towards the camera, and
      // the pitch levels it.
      const wantedYaw = Math.atan2(-node.x, node.z) + Math.PI;
      const wantedPitch = clamp(
        Math.atan2(-node.y, radius),
        -PITCH_LIMIT,
        PITCH_LIMIT,
      );

      // The shorter way round, rather than unwinding through a full turn.
      const delta = (((wantedYaw - aimYaw + Math.PI) % TAU) + TAU) % TAU - Math.PI;
      aimYaw += delta;
      aimPitch = wantedPitch;
      lastInteraction = performance.now();

      if (still) {
        yaw = aimYaw;
        pitch = aimPitch;
        stillFrame();
      }
    };
    aimRef.current = aimAt;

    if (still) {
      // One frame, held. The figure is information, so it stays on the page and
      // simply stops moving. The redraw waits for the font, because canvas text
      // measured before the face loads is measured in the fallback.
      stillFrame();
      document.fonts?.ready.then(() => stillFrame()).catch(() => {});
    } else {
      frame = requestAnimationFrame(step);
    }

    /* Off screen, the loop costs nothing. */
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              const visible = entries[0]?.isIntersecting ?? true;
              if (visible && !still && !running) {
                running = true;
                lastFrame = 0;
                frame = requestAnimationFrame(step);
              } else if (!visible && running && !still) {
                running = false;
                cancelAnimationFrame(frame);
              }
            },
            { rootMargin: "160px" },
          );
    observer?.observe(canvas);

    const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
    resizer?.observe(canvas);
    window.addEventListener("resize", onResize);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizer?.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  /* Selecting a node turns the universe so that node faces the reader. */
  useEffect(() => {
    selectedRef.current = selectedId;
    aimRef.current?.(selectedId);
  }, [selectedId]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={label}
      // Vertical panning stays with the page on touch, so a swipe down reads as
      // a scroll rather than a rotation.
      style={{ touchAction: "pan-y" }}
    />
  );
}

export default SkillUniverseCanvas;
