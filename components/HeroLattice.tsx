"use client";

import { useEffect, useRef } from "react";
import { PALETTE_DEEP as P, tintDeep } from "@/lib/palette";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * The hero sculpture: a neural network drawn in three dimensions.
 *
 * This is a small software renderer, not a scene graph. Every node and edge is
 * projected by hand each frame, depth sorted, fogged, lit by a moving virtual
 * key light and composited from pre-rendered sprites. It costs a few hundred
 * draw calls and no dependency at all.
 *
 * Why not a WebGL library: the sculpture is one decorative layer behind copy,
 * and shipping a renderer that large to draw 80 glowing points would cost more
 * in load time and battery than it returns in fidelity. What carries the
 * illusion here is depth and light, and both are arithmetic.
 *
 * It is decorative, so it is hidden from assistive tech, and it holds a single
 * still frame when the visitor prefers reduced motion.
 */

/** Nodes per layer, input through to output: one layer per pipeline stage. */
const LAYERS = [11, 17, 19, 15, 11, 7];

/** Layer spacing along the figure's depth axis. */
const SPAN = 1500;

/** Camera: focal length in figure units, and the distance it sits back. */
const FOCAL = 760;
const CAMERA_Z = 2050;

/** Milliseconds for a signal to cross one connection. */
const PULSE_MS = 2600;

/** Fog and width are quantised into this many buckets, so the whole wireframe
 *  strokes in a handful of passes instead of one pass per edge. */
const BUCKETS = 3;

/**
 * One connection in three carries a signal.
 *
 * Signals are the most expensive thing on screen (each one is an additive
 * sprite), and lighting every connection at once turns a lattice into confetti.
 * One in three reads as traffic through a network; all of them reads as noise.
 */
const SIGNAL_STRIDE = 4;

/**
 * The bitmap is drawn below device resolution and scaled up.
 *
 * The figure is soft light, so a fraction under native costs nothing visible and
 * removes a third of the pixels that have to be blended every frame. This is the
 * single largest saving in the renderer, and the tier guard below gives it back
 * only when a device can afford it.
 */
const RENDER_SCALE = 0.8;
const DPR_CAP = 1.5;

/** Frame budget in milliseconds, and the rolling window the tiers read. */
const BUDGET_MS = 17;

type Node = {
  x: number;
  y: number;
  z: number;
  layer: number;
  /** Small per-node offset, so the lattice never reads as a grid. */
  wobble: number;
  /** Lighting for the current frame. */
  lit: number;
};

type Edge = {
  a: number;
  b: number;
  /** Stagger, so signals leave their nodes at different moments. */
  offset: number;
  /** Long-range connections are drawn fainter: the skip paths. */
  skip: boolean;
  /** Whether this connection animates a signal. */
  signal: boolean;
};

type Projected = { x: number; y: number; z: number; scale: number };

/** A small deterministic PRNG, so the figure is identical on every load. */
function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildLattice() {
  const nodes: Node[] = [];
  const layerStart: number[] = [];
  const rand = mulberry(20261010);

  for (let layer = 0; layer < LAYERS.length; layer += 1) {
    layerStart.push(nodes.length);
    const count = LAYERS[layer];
    const x = -SPAN / 2 + (layer / (LAYERS.length - 1)) * SPAN;

    // A spindle: widest through the middle and pinched at both ends, which
    // reads as an encoder closing onto a latent space rather than a flat wall.
    const spread = 470 * Math.sin(((layer + 0.6) / LAYERS.length) * Math.PI) + 90;

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + layer * 0.5;
      const radius = spread * (0.55 + rand() * 0.45);
      nodes.push({
        x,
        y: Math.sin(angle) * radius * 0.62,
        z: Math.cos(angle) * radius,
        layer,
        wobble: (rand() - 0.5) * 26,
        lit: 0,
      });
    }
  }

  const edges: Edge[] = [];
  for (let layer = 0; layer < LAYERS.length - 1; layer += 1) {
    const from = layerStart[layer];
    const to = layerStart[layer + 1];
    const fromCount = LAYERS[layer];
    const toCount = LAYERS[layer + 1];

    for (let i = 0; i < fromCount; i += 1) {
      const a = from + i;
      // Each node drives three neighbours in the next layer, picked by angular
      // position rather than at random, so the wiring keeps the spindle's flow.
      const spread = i / fromCount;
      for (let k = 0; k < 3; k += 1) {
        const target = (((spread + (k - 1) * 0.11) % 1) + 1) % 1;
        edges.push({
          a,
          b: to + Math.floor(target * toCount) % toCount,
          offset: (i * 0.37 + layer * 0.61 + k * 0.19) % 1,
          skip: false,
          signal: (i + k + layer) % SIGNAL_STRIDE === 0,
        });
      }
      // One long connection per node, drawn faint: the residue path.
      const jumpLayer = Math.min(layer + 2, LAYERS.length - 1);
      edges.push({
        a,
        b: layerStart[jumpLayer] + ((i * 7 + layer * 3) % LAYERS[jumpLayer]),
        offset: (i * 0.53 + layer) % 1,
        skip: true,
        signal: false,
      });
    }
  }

  return { nodes, edges };
}

/**
 * A soft radial sprite, rendered once and reused for every node and signal.
 *
 * One sprite carries the whole node: a lit core falling away into a wide blue
 * halo. It used to be two passes, a halo and a separate specular core, which
 * doubled the most expensive operation in the frame to draw a highlight the
 * gradient can carry on its own.
 */
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

export function HeroLattice({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const { nodes, edges } = buildLattice();
    const still = prefersReducedMotion();

    // The node: a white-hot core inside the blue it sits in.
    const nodeSprite = makeSprite([
      [0, P.bright],
      [0.14, P.bright],
      [0.34, tintDeep("volt", 0.62)],
      [0.62, tintDeep("accent", 0.2)],
      [1, "rgba(0,0,0,0)"],
    ]);
    // The signal: brighter and tighter, because it is moving.
    const hotSprite = makeSprite([
      [0, P.bright],
      [0.2, tintDeep("volt", 0.9)],
      [0.55, tintDeep("accent", 0.3)],
      [1, "rgba(0,0,0,0)"],
    ]);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let pointerX = 0;
    let pointerY = 0;
    let yaw = -0.42;
    let pitch = -0.06;
    let dolly = 0;
    // 0 is the full figure. The guard below steps this up on a machine that
    // cannot hold the frame budget, and steps it back down when it can.
    let quality = 0;
    let rollingCost = BUDGET_MS;
    let cheapFrames = 0;
    // How far the reader has moved through the hero, 0 to 1, and the camera
    // pull-back it drives. Read from the scroll position rather than a listener
    // so the frame that moves is the frame that reads it.
    let scrollDolly = 0;
    let scrollShift = 0;
    let frame = 0;
    let running = true;
    let slowFrames = 0;
    // Rolling averages the tier guard reads: recording cost, and the far more
    // honest interval between animation frames.
    let rollingInterval = BUDGET_MS;
    let lastFrameTime = 0;

    const projected: Projected[] = nodes.map(() => ({ x: 0, y: 0, z: 0, scale: 1 }));
    const order: number[] = nodes.map((_, i) => i);
    /*
     * Per-edge frame data, allocated once.
     *
     * The frame path allocates nothing on purpose. It used to build six fresh
     * `Path2D` objects every frame, which is 360 short-lived objects a second
     * for the collector to chase, and the pauses showed up as dropped frames
     * long before the drawing itself became the limit.
     */
    const edgeBucket = new Uint8Array(edges.length);
    const edgeFog = new Float32Array(edges.length);

    /** The bitmap resolution this quality tier can afford. */
    const targetDpr = () =>
      Math.min(window.devicePixelRatio || 1, quality >= 2 ? 1 : DPR_CAP) * RENDER_SCALE;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = targetDpr();

      // Assigning either dimension resets the canvas, so only touch them when
      // the pixel size actually changes: a resize event that does not change
      // the bitmap should not cost a reallocation.
      const w = Math.max(1, Math.round(width * dpr));
      const h = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };

    /** Projects and lights the whole lattice into `projected`. */
    const project = (time: number) => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const cameraZ = CAMERA_Z + dolly + scrollDolly;
      const centreY = height * 0.52 - scrollShift;

      // The key light orbits the figure, so faces brighten and fall away as it
      // passes rather than sitting at one fixed exposure.
      const lightAngle = time * 0.00013;
      const lx = Math.cos(lightAngle) * 0.8;
      const ly = -0.35 + Math.sin(lightAngle * 1.3) * 0.2;
      const lz = Math.sin(lightAngle) * 0.8;

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        // The lattice breathes very slightly, so a still page is never quite
        // still, and the ends of the spindle move a touch more than the waist.
        const breathe = 1 + Math.sin(time * 0.00035 + node.layer * 0.5) * 0.06;
        const nx = node.x * breathe;
        const ny = node.y * breathe + node.wobble * 0.3;
        const nz = node.z * breathe;

        const rx = nx * cy + nz * sy;
        const rz = -nx * sy + nz * cy;
        const ry = ny * cp - rz * sp;
        const rz2 = ny * sp + rz * cp;

        const x = width * 0.5 + rx * (FOCAL / cameraZ);
        const y = centreY + ry * (FOCAL / cameraZ);
        const scale = FOCAL / cameraZ;

        const out = projected[i];
        out.x = x;
        out.y = y;
        out.z = rz2;
        out.scale = scale;

        // Lambert against the key light, with a rim term for the near plane.
        const len = Math.hypot(nx, ny, nz) || 1;
        const diffuse = Math.max(0, (nx * lx + ny * ly + nz * lz) / len);
        node.lit = Math.min(1, 0.22 + diffuse * 0.82 + Math.max(0, scale - 0.36) * 1.2);
      }
    };

    const draw = (time: number) => {
      // Ease the camera toward the pointer: the figure turns to face the reader
      // rather than snapping to the cursor.
      yaw += (-0.42 + pointerX * 0.3 - yaw) * 0.045;
      pitch += (-0.06 + pointerY * 0.16 - pitch) * 0.045;
      dolly += (-150 * Math.abs(pointerX) - dolly) * 0.03;

      // Leaving the hero pulls the camera back and lifts the figure a little,
      // which is the transition into the page rather than a cut.
      const travelled =
        typeof window === "undefined"
          ? 0
          : Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
      scrollDolly += (travelled * 520 - scrollDolly) * 0.06;
      scrollShift += (travelled * 90 - scrollShift) * 0.06;

      project(time);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      // One pass to measure every connection: fog, and which stroke bucket it
      // falls in. The drawing passes below then only read these.
      for (let e = 0; e < edges.length; e += 1) {
        const edge = edges[e];
        const depth = (projected[edge.a].z + projected[edge.b].z) * 0.5;
        const fog = 1 - Math.min(1, Math.max(0, (depth + 900) / 2600));
        edgeFog[e] = fog;
        edgeBucket[e] = Math.min(BUCKETS - 1, Math.floor(fog * BUCKETS));
      }

      // A handful of stroke passes rather than one per connection.
      for (let b = 0; b < BUCKETS; b += 1) {
        const fog = (b + 0.5) / BUCKETS;

        ctx.strokeStyle = tintDeep("volt", fog * 0.2);
        ctx.lineWidth = 0.5 + fog * 0.8;
        ctx.beginPath();
        for (let e = 0; e < edges.length; e += 1) {
          const edge = edges[e];
          if (edge.skip || edgeBucket[e] !== b) continue;
          const a = projected[edge.a];
          const b2 = projected[edge.b];
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b2.x, b2.y);
        }
        ctx.stroke();

        // The residue paths are the first thing to go under load: they carry
        // the least information of anything drawn.
        if (quality < 2) {
          ctx.strokeStyle = tintDeep("accent", fog * 0.08);
          ctx.lineWidth = 0.4 + fog * 0.4;
          ctx.beginPath();
          for (let e = 0; e < edges.length; e += 1) {
            const edge = edges[e];
            if (!edge.skip || edgeBucket[e] !== b) continue;
            const a = projected[edge.a];
            const b2 = projected[edge.b];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b2.x, b2.y);
          }
          ctx.stroke();
        }
      }

      // Signals travelling the connections: what makes the figure read as a
      // system running rather than a diagram of one.
      if (!still && quality < 1) {
        for (let e = 0; e < edges.length; e += 1) {
          const edge = edges[e];
          if (!edge.signal) continue;
          const a = projected[edge.a];
          const b = projected[edge.b];

          const t = (time / PULSE_MS + edge.offset) % 1;
          // Out and back along the connection, then a pause before the next.
          const travel = t < 0.42 ? (t / 0.42) * 0.5 : t < 0.5 ? 0.5 : t < 0.92 ? 1 - ((t - 0.5) / 0.42) * 0.5 : 1;
          if (t > 0.92) continue;

          const strength = Math.sin(travel * Math.PI) * edgeFog[e];
          if (strength < 0.18) continue;

          const px = a.x + (b.x - a.x) * travel;
          const py = a.y + (b.y - a.y) * travel;
          const radius = 7 + strength * 5;
          ctx.globalAlpha = strength * 0.5;
          ctx.drawImage(hotSprite, px - radius, py - radius, radius * 2, radius * 2);
        }
        ctx.globalAlpha = 1;
      }

      // Nodes, back to front, so near ones occlude far ones. One sprite each:
      // the light rides the gradient, so brightness varies by alpha alone.
      order.sort((i, j) => projected[i].z - projected[j].z);
      for (let o = 0; o < order.length; o += 1) {
        const index = order[o];
        const node = nodes[index];
        const p = projected[index];

        const fog = 1 - Math.min(1, Math.max(0, (p.z + 800) / 2500));
        const base = Math.max(3.2, 10 * p.scale * 2.3);

        ctx.globalAlpha = Math.min(1, fog * (0.34 + node.lit * 0.72));
        ctx.drawImage(nodeSprite, p.x - base, p.y - base, base * 2, base * 2);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (time: number) => {
      if (!running) return;
      const start = performance.now();
      draw(time);
      const cost = performance.now() - start;

      /*
       * Two signals, because one of them lies.
       *
       * `cost` measures how long it took to *record* the frame, and canvas
       * defers the actual rasterising to the compositor, so on a software
       * rasteriser it stays near zero while frames are visibly being dropped.
       * The interval between animation frames is the honest measure of whether
       * the device is keeping up. Both are rolling averages rather than single
       * frames, so one slow paint elsewhere on the page cannot demote the
       * figure.
       */
      if (lastFrameTime > 0) rollingInterval += (time - lastFrameTime - rollingInterval) * 0.05;
      lastFrameTime = time;
      rollingCost += (cost - rollingCost) * 0.05;

      /*
       * Quality guard. A machine that cannot hold the budget loses effects in
       * the order of what they cost against what they say: signals first, then
       * the residue paths, then bitmap resolution. It recovers the same way,
       * slowly, so the figure settles at the highest quality this device can
       * actually sustain instead of at the one it first drew.
       */        if (Math.max(rollingCost, rollingInterval - BUDGET_MS) > 3 && quality < 3) {
        slowFrames += 1;
        if (slowFrames > 30) {
          quality += 1;
          // Resolution is derived from the tier inside `resize`.
          resize();
          slowFrames = 0;
          cheapFrames = 0;
        }
      } else if (rollingCost < BUDGET_MS - 4 && rollingInterval < BUDGET_MS + 1.5 && quality > 0) {
        slowFrames = 0;
        cheapFrames += 1;
        if (cheapFrames > 240) {
          quality -= 1;
          resize();
          cheapFrames = 0;
        }
      } else {
        slowFrames = Math.max(0, slowFrames - 1);
      }

      frame = requestAnimationFrame(loop);
    };

    resize();

    if (still) {
      // One frame, held: the figure is information about the work, so it should
      // not vanish, it should just stop moving.
      draw(1200);
    } else {
      frame = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    // Stop the loop while the hero is off screen, so the rest of the page costs
    // nothing to scroll.
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              const visible = entries[0]?.isIntersecting ?? true;
              if (visible && !still && !running) {
                running = true;
                frame = requestAnimationFrame(loop);
              } else if (!visible && running) {
                running = false;
                cancelAnimationFrame(frame);
              }
            },
            { rootMargin: "120px" },
          );
    observer?.observe(canvas);

    const onResize = () => {
      resize();
      if (still) draw(1200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

export default HeroLattice;
