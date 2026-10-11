"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { CORE_NODES, type CoreNode } from "@/lib/core-nodes";
import { PALETTE_DEEP as P } from "@/lib/palette";

/**
 * The hero sculpture: a translucent core with four capability nodes around it,
 * wired to it by struts that carry a pulse.
 *
 * Three rendering notes worth keeping, because each was a deliberate choice:
 *
 * - The environment is built from `Lightformer`s rather than a `preset`. A
 *   preset fetches an HDRI from a CDN, which would put a network dependency and
 *   a third-party request in front of every visit. What carries the glass and
 *   the metal here is a studio built in code, and it is baked once (`frames={1}`)
 *   because the light never moves.
 * - The labels are HTML, not 3D text. A `Text` node needs a font file, again
 *   fetched; `Html` gives the site's own type instead, and keeps the labels
 *   crisp at any camera distance. Their z-index range is capped below the site
 *   chrome (the bar sits at z-80), so a label can never cover the navigation.
 * - Transmission glass is the expensive part of this scene, so it only renders
 *   where the device can carry it. Everywhere else the core is a polished metal
 *   shell against the same environment, which still reads as a real object.
 *
 * The canvas is decorative in the accessibility tree: the hero's index row is
 * the readable, keyboard-reachable path to the same four nodes.
 */

/**
 * Capability reads, done once at module scope.
 *
 * These are read through `useSyncExternalStore` rather than set from an effect.
 * An effect that calls `setState` on mount buys nothing here and costs a second
 * render pass of the whole hero, which is what the hook exists to avoid: the
 * server snapshot keeps the first client render identical to the HTML, and the
 * real value arrives straight after hydration.
 *
 * The probe is cached because React may read the snapshot more than once, and
 * creating a canvas per read would be the expensive part of a cheap question.
 */
const neverChanges = () => () => {};

let webglSupport: boolean | null = null;

function readWebgl(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const probe = document.createElement("canvas");
    webglSupport = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

let deviceQuality: Quality | null = null;

/**
 * Whether the device is likely to carry transmission glass.
 *
 * A guess from two hints rather than a measurement, which is deliberate: the
 * cost of guessing wrong is a slightly plainer core, and measuring would mean
 * rendering the expensive thing first to find out.
 */
function readQuality(): Quality {
  if (deviceQuality !== null) return deviceQuality;
  const smallScreen = window.matchMedia("(max-width: 767px)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  deviceQuality = !smallScreen && cores >= 8 ? "high" : "low";
  return deviceQuality;
}

const RING_RADIUS = 2.05;
const CORE_RADIUS = 0.82;

/**
 * The world radius that must always be visible: the node ring plus its halos.
 *
 * The camera is fitted to this rather than parked at a fixed distance, because
 * the canvas box is a different shape at every breakpoint. A fixed distance
 * that frames the ring on a wide box crops it on a narrow one.
 */
const FIT_RADIUS = 2.6;

type Quality = "high" | "low";

/**
 * Places the camera so a sphere of `FIT_RADIUS` always fits the canvas, on both
 * axes, and points it at the centre.
 *
 * `r / sin(fov / 2)` is the exact distance at which a sphere of radius `r`
 * subtends the field of view, so the fit is arithmetic rather than a fudge
 * factor per breakpoint.
 */
function FitCamera() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.35);
    const vertical = (perspective.fov * Math.PI) / 180;
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * aspect);

    const toFitBoth = Math.max(
      FIT_RADIUS / Math.sin(vertical / 2),
      FIT_RADIUS / Math.sin(horizontal / 2),
    );

    perspective.position.set(0, 0, toFitBoth * 1.02);
    perspective.lookAt(0, 0, 0);
    perspective.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

/** A point on the node ring, in the ring's own plane. */
function ringPosition(angle: number): THREE.Vector3 {
  const radians = (angle * Math.PI) / 180;
  return new THREE.Vector3(
    Math.cos(radians) * RING_RADIUS,
    0,
    Math.sin(radians) * RING_RADIUS,
  );
}

/**
 * The pointer lean and the slow turn, kept on separate groups.
 *
 * Split because they are different motions: the turn accumulates on the inner
 * group and the lean is set absolutely on the outer one, so a moving pointer
 * cannot disturb the drift and the drift cannot fight the pointer.
 */
function Rig({ still, children }: { still: boolean; children: ReactNode }) {
  const lean = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const current = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (spin.current && !still) spin.current.rotation.y += delta * 0.085;

    const group = lean.current;
    if (!group) return;

    const targetX = state.pointer.y * 0.22;
    const targetY = state.pointer.x * 0.34;
    const ease = still ? 1 : 0.055;
    current.current.x += (targetX - current.current.x) * ease;
    current.current.y += (targetY - current.current.y) * ease;
    group.rotation.x = current.current.x;
    group.rotation.y = current.current.y;
  });

  return (
    <group ref={lean}>
      <group ref={spin}>{children}</group>
    </group>
  );
}

/** A hairline cylinder between two points: the wire from the core to a node. */
function Strut({
  from,
  to,
  active,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  active: boolean;
}) {
  const { geometry, position, quaternion } = useMemo(() => {
    const direction = new THREE.Vector3().subVectors(to, from);
    return {
      geometry: new THREE.CylinderGeometry(0.006, 0.006, direction.length(), 6, 1, true),
      position: new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize(),
      ),
    };
  }, [from, to]);

  return (
    <mesh geometry={geometry} position={position} quaternion={quaternion}>
      <meshBasicMaterial
        color={active ? P.accent : P.volt}
        transparent
        opacity={active ? 0.5 : 0.15}
      />
    </mesh>
  );
}

/** The energy flow: one travelling bead per strut, fading at both ends. */
function Pulse({
  from,
  to,
  offset,
  active,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  offset: number;
  active: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const middle = useMemo(
    () => new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5),
    [from, to],
  );

  useFrame((state) => {
    const bead = mesh.current;
    const ink = material.current;
    if (!bead || !ink) return;
    const progress = (state.clock.elapsedTime * 0.18 + offset) % 1;
    bead.position.lerpVectors(from, to, progress);
    // Fade in and out at the ends so nothing pops into existence mid-flight.
    const fade = Math.sin(Math.PI * progress);
    ink.opacity = (active ? 0.85 : 0.4) * fade;
    bead.scale.setScalar(0.7 + 0.5 * fade);
  });

  return (
    <mesh ref={mesh} position={middle}>
      <sphereGeometry args={[0.032, 12, 12]} />
      <meshBasicMaterial ref={material} color={P.accent} transparent opacity={0.4} />
    </mesh>
  );
}

/** One capability: a metal bead, a hairline halo, and an HTML label. */
function NodeOrb({
  node,
  position,
  active,
  onActivate,
}: {
  node: CoreNode;
  position: THREE.Vector3;
  active: boolean;
  onActivate: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = active || hovered;
  const halo = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (halo.current) halo.current.rotation.z += delta * (lit ? 0.5 : 0.16);
  });

  return (
    <group position={position}>
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onActivate(node.id);
        }}
      >
        <sphereGeometry args={[0.115, 32, 32]} />
        <meshStandardMaterial
          color={lit ? P.bright : P.soft}
          metalness={1}
          roughness={lit ? 0.16 : 0.34}
          envMapIntensity={1.7}
          emissive={P.accent}
          emissiveIntensity={lit ? 0.45 : 0.05}
        />
      </mesh>

      <mesh ref={halo} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.185, 0.0035, 8, 64]} />
        <meshBasicMaterial color={P.accent} transparent opacity={lit ? 0.8 : 0.2} />
      </mesh>

      {/*
        `pointerEvents: none` matters: these label divs sit over the canvas, and
        without it they would intercept the pointer and make the node behind
        them unhoverable.
      */}
      <Html
        center
        position={[0, -0.42, 0]}
        zIndexRange={[30, 0]}
        style={{ pointerEvents: "none" }}
      >
        <span
          className={
            lit
              ? "whitespace-nowrap rounded-full border border-accent/50 bg-void/85 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent"
              : "whitespace-nowrap rounded-full border border-volt/20 bg-void/75 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted"
          }
        >
          {node.label}
        </span>
      </Html>
    </group>
  );
}

/** The core: a glass shell over a metal body, with a small lit heart. */
function CoreShell({ quality }: { quality: Quality }) {
  const shell = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!shell.current) return;
    shell.current.rotation.y += delta * 0.05;
    shell.current.rotation.x += delta * 0.012;
  });

  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[CORE_RADIUS, 1]} />
        {quality === "high" ? (
          <meshPhysicalMaterial
            color={P.ice}
            transmission={0.95}
            thickness={1.15}
            roughness={0.06}
            metalness={0}
            ior={1.45}
            envMapIntensity={1.4}
          />
        ) : (
          <meshPhysicalMaterial
            color={P.panel3}
            metalness={0.85}
            roughness={0.12}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
            envMapIntensity={1.8}
            transparent
            opacity={0.72}
          />
        )}
      </mesh>

      <mesh>
        <dodecahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color={P.soft}
          metalness={1}
          roughness={0.18}
          envMapIntensity={2}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshBasicMaterial color={P.accent} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Scene({
  activeId,
  onActivate,
  still,
  quality,
}: {
  activeId: string | null;
  onActivate: (id: string) => void;
  still: boolean;
  quality: Quality;
}) {
  const nodes = useMemo(
    () =>
      CORE_NODES.map((node, index) => ({
        node,
        position: ringPosition(node.angle),
        offset: index / CORE_NODES.length,
      })),
    [],
  );

  return (
    <>
      <FitCamera />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color={P.bright} />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color={P.accent} />

      <Environment resolution={128} frames={1}>
        <color attach="background" args={[P.void]} />
        <Lightformer intensity={2.2} position={[0, 5, -7]} scale={[12, 12, 1]} color={P.soft} />
        <Lightformer
          intensity={1.6}
          position={[-6, 1, 1]}
          rotation-y={Math.PI / 2}
          scale={[9, 7, 1]}
          color={P.accent}
        />
        <Lightformer
          intensity={1.1}
          position={[6, -1, -1]}
          rotation-y={-Math.PI / 2}
          scale={[9, 7, 1]}
          color={P.bright}
        />
        <Lightformer
          intensity={0.6}
          position={[0, -6, 2]}
          rotation-x={Math.PI / 2}
          scale={[12, 8, 1]}
          color={P.muted}
        />
      </Environment>

      <Rig still={still}>
        <CoreShell quality={quality} />
        {/* The ring is tilted, so the four nodes read as a plane in space. */}
        <group rotation={[-0.22, 0, 0]}>
          {nodes.map(({ node, position, offset }) => {
            const active = node.id === activeId;
            const inner = position.clone().normalize().multiplyScalar(CORE_RADIUS + 0.06);
            return (
              <group key={node.id}>
                <Strut from={inner} to={position} active={active} />
                <Pulse from={inner} to={position} offset={offset} active={active} />
                <NodeOrb
                  node={node}
                  position={position}
                  active={active}
                  onActivate={onActivate}
                />
              </group>
            );
          })}
        </group>
      </Rig>
    </>
  );
}

export type IntelligenceCoreProps = {
  activeId: string | null;
  onActivate: (id: string) => void;
  /** Reduced motion: no drift, one frame. */
  still: boolean;
  className?: string;
};

export function IntelligenceCore({
  activeId,
  onActivate,
  still,
  className,
}: IntelligenceCoreProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  // Rendering the canvas only after a successful probe is what keeps a machine
  // without WebGL from throwing inside the renderer.
  const supported = useSyncExternalStore(neverChanges, readWebgl, () => false);
  const quality = useSyncExternalStore(neverChanges, readQuality, () => "low" as Quality);

  useEffect(() => {
    const host = wrapRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const live = supported && inView && !still;

  return (
    <div ref={wrapRef} className={className}>
      {supported ? (
        <Canvas
          dpr={[1, 1.6]}
          // "always" only while the hero is on screen and motion is allowed;
          // otherwise the scene renders once and the GPU goes quiet.
          frameloop={live ? "always" : "demand"}
          camera={{ position: [0, 0, 9], fov: 38, near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene
            activeId={activeId}
            onActivate={onActivate}
            still={still}
            quality={quality}
          />
        </Canvas>
      ) : null}
    </div>
  );
}

export default IntelligenceCore;
