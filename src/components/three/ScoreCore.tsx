import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Html, Lightformer, Environment as DreiEnv } from "@react-three/drei";
import * as THREE from "three";

export type Factor = { key: string; label: string; value: number; color: string };

/** One sub-score: a satellite on its own tilted orbit whose radius encodes the value. */
function Satellite({ f, i, n, active, onHover }: { f: Factor; i: number; n: number; active: boolean; onHover: (k: string | null) => void }) {
  const ref = useRef<THREE.Group>(null);
  const tilt = useMemo(() => new THREE.Euler((i / n) * Math.PI * 0.9 - 0.4, 0, (i % 2 ? 1 : -1) * 0.35), [i, n]);
  const r = 1.9 + (i % 3) * 0.32;
  const ring = useMemo(() => {
    const pts = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2).getPoints(128).map((p) => new THREE.Vector3(p.x, 0, p.y));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [r]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * (0.18 + i * 0.03) + (i / n) * Math.PI * 2;
    ref.current!.position.set(Math.cos(t) * r, 0, Math.sin(t) * r);
  });
  const color = new THREE.Color(f.color);
  return (
    <group rotation={tilt}>
      <lineLoop geometry={ring}>
        <lineBasicMaterial color={color} transparent opacity={active ? 0.7 : 0.18} />
      </lineLoop>
      <group ref={ref}>
        <mesh onPointerOver={() => onHover(f.key)} onPointerOut={() => onHover(null)} scale={active ? 1.6 : 1}>
          <icosahedronGeometry args={[0.045 + f.value / 1800, 2]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <Html center distanceFactor={5} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-wider transition-all ${
              active ? "border-white/40 bg-black/70 text-white" : "border-white/10 bg-black/40 text-white/60"
            }`}
            style={{ transform: "translateY(-22px)" }}
          >
            {f.label.toUpperCase()} · {f.value}
          </div>
        </Html>
      </group>
    </group>
  );
}

function Core({ score }: { score: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    ref.current!.rotation.y += dt * 0.25;
    ref.current!.rotation.x += dt * 0.08;
  });
  const color = new THREE.Color("#5ad1ff").lerp(new THREE.Color("#c6ff3d"), score / 100);
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.05, 24]} />
        <MeshDistortMaterial color="#22331a" emissive={color} emissiveIntensity={0.06} roughness={0.22} metalness={0.35} distort={0.34} speed={1.6} />
      </mesh>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

export default function ScoreCore({
  factors,
  score,
  active,
  hovered,
  onHover,
}: {
  factors: Factor[];
  score: number;
  active: boolean;
  hovered: string | null;
  onHover: (k: string | null) => void;
}) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} camera={{ position: [0, 1.6, 7.6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 3, 4]} intensity={60} color="#c6ff3d" />
      <pointLight position={[-4, -2, 2]} intensity={50} color="#5ad1ff" />
      <pointLight position={[0, -4, -3]} intensity={30} color="#ff7a3d" />
      {/* Procedural studio reflections: no HDR download. */}
      <DreiEnv resolution={128}>
        <Lightformer form="ring" intensity={3} color="#c6ff3d" position={[2, 2, 3]} scale={2} />
        <Lightformer form="rect" intensity={2} color="#5ad1ff" position={[-3, 0, 2]} scale={[1, 4, 1]} />
        <Lightformer form="rect" intensity={1} color="#ffffff" position={[0, 4, -2]} scale={[6, 1, 1]} />
      </DreiEnv>
      <Core score={score} />
      {factors.map((f, i) => (
        <Satellite key={f.key} f={f} i={i} n={factors.length} active={hovered === f.key} onHover={onHover} />
      ))}
    </Canvas>
  );
}
