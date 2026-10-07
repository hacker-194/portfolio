"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { PointerEvent } from "react";
import { NETWORK_NODES } from "@/lib/data";
import { PALETTE, tint } from "@/lib/palette";

/* ------------------------------------------------------------------ *
 * Scene geometry
 * ------------------------------------------------------------------ */

const SPREAD_X = 10.4;
const SPREAD_Y = 3.4;

type NodeSpec = {
  id: string;
  label: string;
  detail: string;
  position: THREE.Vector3;
};

function buildNodes(): NodeSpec[] {
  return NETWORK_NODES.map((node, index) => {
    const position = new THREE.Vector3(
      (node.x - 0.5) * SPREAD_X,
      (0.5 - node.y) * SPREAD_Y,
      ((index % 3) - 1) * 0.85,
    );
    return {
      id: node.id,
      label: node.label,
      detail: node.detail,
      position,
    };
  });
}

/** Sequential chain plus a few skip connections — reads as a graph, not a list. */
const LINK_PAIRS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [1, 4],
];

/* ------------------------------------------------------------------ *
 * Textures
 * ------------------------------------------------------------------ */

/** Soft radial glow sprite, generated once on the client. */
function useGlowTexture() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    // The centre runs hotter than any palette colour on purpose — it is the
    // clipped core of the sprite rather than a themed surface.
    gradient.addColorStop(0, "rgba(255,244,222,1)");
    gradient.addColorStop(0.18, tint("gold", 0.92));
    gradient.addColorStop(0.42, tint("ember", 0.5));
    gradient.addColorStop(0.72, tint("burnt", 0.16));
    gradient.addColorStop(1, tint("burnt", 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}

/* ------------------------------------------------------------------ *
 * Pieces
 * ------------------------------------------------------------------ */

function Nodes({ nodes, texture }: {
  nodes: NodeSpec[];
  texture: THREE.Texture | null;
}) {
  const positions = useMemo(() => {
    const array = new Float32Array(nodes.length * 3);
    nodes.forEach((node, index) => {
      array[index * 3] = node.position.x;
      array[index * 3 + 1] = node.position.y;
      array[index * 3 + 2] = node.position.z;
    });
    return array;
  }, [nodes]);

  return (
    <group>
      {/* Glow cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture ?? undefined}
          size={1.7}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Solid cores so the nodes read even without the sprite */}
      {nodes.map((node) => (
        <mesh key={node.id} position={node.position}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color="#fff3dc" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Pulses({ nodes }: { nodes: NodeSpec[] }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const links = useMemo(
    () =>
      LINK_PAIRS.map(([from, to], index) => ({
        a: nodes[from].position,
        b: nodes[to].position,
        offset: (index * 0.137) % 1,
        speed: 0.16 + (index % 4) * 0.045,
      })),
    [nodes],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    for (let i = 0; i < links.length; i += 1) {
      const mesh = refs.current[i];
      if (!mesh) continue;
      const link = links[i];
      const progress = (time * link.speed + link.offset) % 1;
      mesh.position.lerpVectors(link.a, link.b, progress);
      const scale = 0.55 + Math.sin(progress * Math.PI) * 0.75;
      mesh.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {links.map((link, index) => (
        <mesh
          key={`${link.offset}-${index}`}
          ref={(node) => {
            refs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.062, 10, 10]} />
          <meshBasicMaterial
            color={index % 3 === 0 ? PALETTE.gold : PALETTE.ember}
            toneMapped={false}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

function Connections({ nodes }: { nodes: NodeSpec[] }) {
  return (
    <group>
      {LINK_PAIRS.map(([from, to]) => (
        <Line
          key={`${from}-${to}`}
          points={[nodes[from].position, nodes[to].position]}
          color={PALETTE.ember}
          transparent
          opacity={0.22}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

function Labels({ nodes }: { nodes: NodeSpec[] }) {
  return (
    <group>
      {nodes.map((node) => (
        <Html
          key={node.id}
          position={[node.position.x, node.position.y - 0.62, node.position.z]}
          center
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="flex -translate-y-1/2 flex-col items-center gap-1 whitespace-nowrap">
            <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-bone">
              {node.label}
            </span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-flare/70">
              {node.detail}
            </span>
          </div>
        </Html>
      ))}
    </group>
  );
}

/** Tilts the whole graph toward the pointer, with a slow idle float. */
function Rig({ children, still }: { children: React.ReactNode; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const setPointer = useCallback((x: number, y: number) => {
    pointer.current.x = x;
    pointer.current.y = y;
  }, []);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node || still) return;

    const damping = Math.min(1, delta * 1.6);
    const t = state.clock.elapsedTime;
    const idleY = Math.sin(t * 0.35) * 0.06;
    const idleX = Math.cos(t * 0.42) * 0.04;

    const targetY = -0.18 + idleY + pointer.current.x * 0.34;
    const targetX = 0.06 + idleX + pointer.current.y * -0.22;

    node.rotation.y += (targetY - node.rotation.y) * damping;
    node.rotation.x += (targetX - node.rotation.x) * damping;
    node.position.y = Math.sin(t * 0.45) * 0.08;
  });

  useEffect(() => {
    if (still) return;

    const onMove = (event: globalThis.PointerEvent) => {
      setPointer(
        event.clientX / window.innerWidth - 0.5,
        -(event.clientY / window.innerHeight - 0.5),
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  return <group ref={group}>{children}</group>;
}

/* ------------------------------------------------------------------ *
 * Public component
 * ------------------------------------------------------------------ */

export type NeuralNetworkProps = {
  /** Pause the render loop when the section is off screen. */
  running?: boolean;
  className?: string;
};

export function NeuralNetwork({
  running = true,
  className,
}: NeuralNetworkProps) {
  const nodes = useMemo(() => buildNodes(), []);
  const texture = useGlowTexture();

  return (
    <div className={className}>
      <Canvas
        frameloop={running ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8.4], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Rig still={!running}>
          <Connections nodes={nodes} />
          <Nodes nodes={nodes} texture={texture} />
          <Pulses nodes={nodes} />
          <Labels nodes={nodes} />
        </Rig>
      </Canvas>
    </div>
  );
}

export default NeuralNetwork;
