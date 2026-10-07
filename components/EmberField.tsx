"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";

/* ------------------------------------------------------------------ *
 * Field geometry
 * ------------------------------------------------------------------ */

/** How far the field extends sideways and vertically, in world units. */
const SPREAD_X = 30;
const SPREAD_Y = 20;

/**
 * Drift range along z, in world units. Motes travel toward the camera and
 * recycle at the near edge, so the volume never visibly empties.
 *
 * Must stay in sync with `NEAR` / `SPAN` in the vertex shader.
 */
const WRAP_NEAR = -26;
const WRAP_SPAN = 31;

/** Palette share per mote: mostly ember, a little gold for the highlights. */
const TINTS: { hex: string; share: number }[] = [
  { hex: PALETTE.ember, share: 0.56 },
  { hex: PALETTE.burnt, share: 0.22 },
  { hex: PALETTE.flare, share: 0.14 },
  { hex: PALETTE.gold, share: 0.08 },
];

type MoteField = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  alphas: Float32Array;
  speeds: Float32Array;
};

/**
 * `"#fd7c02"` → `[0.992, 0.486, 0.008]`.
 *
 * Deliberately not `THREE.Color`: that would convert the value into three's
 * linear working space, and this material writes its colour straight to the
 * framebuffer with no output transform. Handing the raw sRGB triplet over means
 * a mote at full alpha lands on exactly the palette colour.
 */
function srgbTriplet(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

const TINT_TRIPLETS = TINTS.map((tint) => ({
  ...srgbTriplet(tint.hex),
  share: tint.share,
}));

/**
 * Seeded PRNG (mulberry32), so the field is laid out identically on every load.
 * A background that reshuffles itself each visit reads as noise rather than as
 * a place.
 */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMoteField(count: number): MoteField {
  const random = createRandom(0x5eed);
  const field: MoteField = {
    positions: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
    sizes: new Float32Array(count),
    alphas: new Float32Array(count),
    speeds: new Float32Array(count),
  };

  for (let i = 0; i < count; i += 1) {
    const roll = random();
    let cursor = 0;
    let tint = TINT_TRIPLETS[TINT_TRIPLETS.length - 1];
    for (const candidate of TINT_TRIPLETS) {
      cursor += candidate.share;
      if (roll <= cursor) {
        tint = candidate;
        break;
      }
    }

    field.positions[i * 3] = (random() - 0.5) * SPREAD_X * 2;
    field.positions[i * 3 + 1] = (random() - 0.5) * SPREAD_Y * 2;
    field.positions[i * 3 + 2] = WRAP_NEAR + random() * WRAP_SPAN;

    field.colors[i * 3] = tint[0];
    field.colors[i * 3 + 1] = tint[1];
    field.colors[i * 3 + 2] = tint[2];

    // Intrinsic mote radius. Perspective scaling happens in the shader, so this
    // only sizes one mote against another.
    field.sizes[i] = 0.4 + random() * 0.7;
    field.alphas[i] = 0.45 + random() * 0.5;
    field.speeds[i] = 0.5 + random() * 1.4;
  }

  return field;
}

/* ------------------------------------------------------------------ *
 * Shaders
 *
 * Both are written to stand alone: no three.js shader chunks, and colours are
 * passed through as sRGB rather than being converted, so what the palette
 * defines is what reaches the screen.
 * ------------------------------------------------------------------ */

const VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aSpeed;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying vec3 vColor;

  // Must match WRAP_NEAR / WRAP_SPAN in EmberField.tsx.
  const float NEAR = -26.0;
  const float SPAN = 31.0;

  void main() {
    // Recycle along z: motes stream past the camera and reappear at the far
    // edge, so the field never thins out.
    float z = NEAR + mod(position.z - NEAR + uTime * aSpeed, SPAN);

    vec4 viewPosition = modelViewMatrix * vec4(position.x, position.y, z, 1.0);
    float distanceToCamera = -viewPosition.z;

    vColor = aColor;
    vAlpha = aAlpha
      * smoothstep(9.0, 12.0, distanceToCamera)
      * (1.0 - smoothstep(20.0, 36.0, distanceToCamera));

    gl_PointSize = clamp(aSize * uPixelRatio * 300.0 / distanceToCamera, 2.0, 72.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // Round, soft-edged mote drawn without a sprite texture. Note the argument
    // order: GLSL leaves smoothstep undefined when edge0 >= edge1, so the
    // falloff is inverted explicitly rather than by swapping the edges.
    float radius = length(gl_PointCoord - vec2(0.5));
    if (radius > 0.5) discard;

    // Solid core, soft rim. A pure radial ramp concentrates almost all of the
    // sprite's visible area into a couple of pixels, which reads as noise
    // rather than as a mote.
    float falloff = 1.0 - smoothstep(0.22, 0.5, radius);
    gl_FragColor = vec4(vColor, falloff * vAlpha);
  }
`;

/* ------------------------------------------------------------------ *
 * Scene
 * ------------------------------------------------------------------ */

function Motes({
  count,
  still,
  interactive,
}: {
  count: number;
  still: boolean;
  interactive: boolean;
}) {
  const field = useMemo(() => buildMoteField(count), [count]);
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }),
    [],
  );

  // The canvas is `pointer-events-none`, so R3F's own pointer never fires here.
  // Reading window events into a ref keeps this off the React render path.
  useEffect(() => {
    if (!interactive || still) return;

    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, still]);

  // Point sizes are in device pixels, so the ratio must be applied before the
  // single frame that reduced motion renders.
  useEffect(() => {
    const shader = material.current;
    if (shader) shader.uniforms.uPixelRatio.value = gl.getPixelRatio();
    invalidate();
  }, [gl, invalidate]);

  useFrame((state, delta) => {
    const shader = material.current;
    const node = group.current;
    if (!shader || !node) return;

    shader.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    if (still) return;

    shader.uniforms.uTime.value += delta;

    const time = state.clock.elapsedTime;
    const damping = Math.min(1, delta * 1.8);

    // A slow autonomous sway only; the reader's pointer can nudge the field
    // toward it without being the sole driver of the lean.
    const targetY = Math.sin(time * 0.05) * 0.06 + pointer.current.x * 0.16;
    const targetX = Math.cos(time * 0.07) * 0.03 + pointer.current.y * 0.10;

    node.rotation.y += (targetY - node.rotation.y) * damping;
    node.rotation.x += (targetX - node.rotation.x) * damping;
    node.position.x += (pointer.current.x * 1.6 - node.position.x) * damping;
    node.position.y += (pointer.current.y * 1.1 - node.position.y) * damping;
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[field.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[field.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[field.sizes, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[field.alphas, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[field.speeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export type EmberFieldProps = {
  /** Reduced motion: render a single static frame and never animate. */
  still?: boolean;
  /** Coarse pointer / low power: fewer motes and a tighter pixel ratio. */
  simplified?: boolean;
  /** False while the tab is hidden, so nothing renders off screen. */
  running?: boolean;
  /** False on touch devices, which have no pointer to follow. */
  interactive?: boolean;
  className?: string;
};

/**
 * The site's 3D background: a slow drift of ember motes in real perspective,
 * leaning with the reader's pointer.
 *
 * Deliberately one draw call, with no textures, no per-frame allocation and no
 * lighting, so it can sit behind every section without competing with the
 * content for frame time.
 */
export function EmberField({
  still = false,
  simplified = false,
  running = true,
  interactive = true,
  className,
}: EmberFieldProps) {
  const count = simplified ? 1100 : 2200;

  return (
    <div className={className}>
      <Canvas
        frameloop={running && !still ? "always" : "demand"}
        dpr={[1, simplified ? 1 : 1.5]}
        camera={{ position: [0, 0, 14], fov: 50, near: 0.1, far: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Motes count={count} still={still} interactive={interactive} />
      </Canvas>
    </div>
  );
}

export default EmberField;
