import { useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial, Grid, Sparkles, Float, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/*
  The night-game hero. A glossy ball flies a luminous arc over a reflective,
  floodlit field and lands in the scoring ring. The flight is driven either by
  scroll (`progress`, 0..1) or, in "idle" mode, by time.
*/

const COBALT = new THREE.Color("#3b5bff");
const COBALT_LIGHT = new THREE.Color("#8ea0ff");
const SIGNAL = new THREE.Color("#ff5a1f");
const NIGHT = "#070b18";

const smooth = (x: number) => x * x * (3 - 2 * x);

function useArc(lite: boolean) {
  return useMemo(() => {
    const span = lite ? 7 : 9;
    // Shifted right on wide screens so the launch sits clear of the headline.
    const dx = lite ? 0 : 1.6;
    return new THREE.CubicBezierCurve3(
      new THREE.Vector3(-span / 2 + 0.9 + dx, 0.35, 0.9),
      new THREE.Vector3(-span / 5 + dx, 6.2, 0.4),
      new THREE.Vector3(span / 5 + dx, 6.0, -1.2),
      new THREE.Vector3(span / 2 + dx, 0.35, -2.2)
    );
  }, [lite]);
}

/** Luminous trajectory: cobalt at launch heating to orange at the ball. Drawn up to the ball. */
function Trajectory({ curve, t }: { curve: THREE.Curve<THREE.Vector3>; t: RefObject<number> }) {
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 320, 0.045, 16, false), [curve]);
  const guide = useMemo(() => new THREE.TubeGeometry(curve, 320, 0.012, 8, false), [curve]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uT: { value: 0 }, uA: { value: COBALT }, uB: { value: SIGNAL }, uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          uniform float uT; uniform float uTime; uniform vec3 uA; uniform vec3 uB; varying vec2 vUv;
          void main(){
            float x = vUv.x;
            if (x > uT) discard;
            float head = smoothstep(uT - 0.18, uT, x);
            vec3 col = mix(uA, uB, smoothstep(0.0, 1.0, x / max(uT, 0.001)));
            float shimmer = 0.85 + 0.15 * sin(x * 140.0 - uTime * 6.0);
            float a = smoothstep(0.0, 0.03, x) * (0.55 + 0.45 * head) * shimmer;
            gl_FragColor = vec4(col * (1.2 + head * 1.6), a);
          }`,
      }),
    []
  );
  useFrame((_, dt) => {
    mat.uniforms.uT.value = t.current ?? 0;
    mat.uniforms.uTime.value += dt;
  });
  return (
    <group>
      <mesh geometry={guide}>
        <meshBasicMaterial color={COBALT_LIGHT} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh geometry={geo} material={mat} />
    </group>
  );
}

/** A clean, Braun-like ball: signal orange, clearcoat, two seams. */
function Ball({ curve, t }: { curve: THREE.Curve<THREE.Vector3>; t: RefObject<number> }) {
  const g = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame((_, dt) => {
    const k = Math.min(0.9999, Math.max(0.0001, t.current ?? 0));
    const p = curve.getPointAt(k);
    g.current!.position.copy(p);
    spin.current!.rotation.x += dt * 2.2;
    spin.current!.rotation.z += dt * 0.7;
    if (light.current) light.current.intensity = 6 + Math.sin(performance.now() / 300) * 0.6;
  });
  return (
    <group ref={g}>
      <pointLight ref={light} color="#ff7a45" distance={6} decay={2} intensity={6} />
      <group ref={spin}>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 64, 64]} />
          <meshPhysicalMaterial color="#ff6a2b" roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} sheen={0.5} sheenColor="#ffc2a3" emissive="#ff4a10" emissiveIntensity={0.42} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.342, 0.007, 12, 96]} />
          <meshStandardMaterial color="#5c1a05" roughness={0.6} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.342, 0.007, 12, 96]} />
          <meshStandardMaterial color="#5c1a05" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/** Scoring ring at the landing point: lights up as the ball arrives. */
function Target({ at, t }: { at: THREE.Vector3; t: RefObject<number> }) {
  const rings = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  useFrame(({ clock }) => {
    const near = smooth(Math.min(1, Math.max(0, ((t.current ?? 0) - 0.72) / 0.28)));
    rings.current!.children.forEach((c, i) => {
      c.rotation.z = clock.elapsedTime * (0.15 + i * 0.08) * (i % 2 ? -1 : 1);
      const s = 1 + near * 0.12 + Math.sin(clock.elapsedTime * 2 - i) * 0.015;
      c.scale.setScalar(s);
    });
    mats.current.forEach((m, i) => (m.opacity = (0.25 + near * 0.65) * (1 - i * 0.18)));
  });
  return (
    <group position={[at.x, 0.012, at.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <group ref={rings}>
        {[0.55, 0.9, 1.3, 1.75].map((r, i) => (
          <mesh key={r}>
            <ringGeometry args={[r, r + (i === 0 ? 0.05 : 0.022), 128, 1, 0, Math.PI * (i === 2 ? 1.5 : 2)]} />
            <meshBasicMaterial ref={(m) => { if (m) mats.current[i] = m; }} color={i === 0 ? SIGNAL : COBALT_LIGHT} transparent toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Floor({ lite }: { lite: boolean }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        {lite ? (
          <meshStandardMaterial color="#0a1022" roughness={0.55} metalness={0.4} />
        ) : (
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={1}
          mixStrength={22}
          roughness={0.85}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a1022"
          metalness={0.6}
          mirror={0.6}
        />
        )}
      </mesh>
      <Grid
        position={[0, 0.006, 0]}
        args={[60, 60]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#1a2547"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#2c3f8f"
        fadeDistance={26}
        fadeStrength={2.2}
        infiniteGrid
      />
    </group>
  );
}

function Rig({ t, lite }: { t: RefObject<number>; lite: boolean }) {
  const { camera, pointer } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const from = useMemo(() => ({ pos: new THREE.Vector3(-3.2, 1.6, 9.5), look: new THREE.Vector3(-0.5, 2.6, 0) }), []);
  const to = useMemo(() => ({ pos: new THREE.Vector3(3.6, 2.4, 8.2), look: new THREE.Vector3(2.2, 1.4, -1) }), []);
  useFrame((_, dt) => {
    const k = smooth(Math.min(1, Math.max(0, t.current ?? 0)));
    const target = from.pos.clone().lerp(to.pos, k);
    target.x += pointer.x * 0.6;
    target.y += pointer.y * 0.35;
    if (lite) target.z += 3.5;
    camera.position.lerp(target, 1 - Math.exp(-dt * 3));
    look.lerpVectors(from.look, to.look, k);
    // On phones the copy sits at the top, so tilt the camera up to drop the scene lower.
    if (lite) look.y += 2.6;
    camera.lookAt(look);
  });
  return null;
}

/** Advances `t` from scroll progress, or loops it when idle. */
function Driver({ progress, t, idle }: { progress?: RefObject<number>; t: RefObject<number>; idle: boolean }) {
  const clock = useRef(0);
  useFrame((_, dt) => {
    if (idle) {
      clock.current = (clock.current + dt * 0.16) % 1.35;
      t.current = Math.min(1, smooth(Math.min(1, clock.current)));
    } else {
      const target = Math.min(1, Math.max(0.02, progress?.current ?? 0));
      t.current = t.current + (target - t.current) * (1 - Math.exp(-dt * 5));
    }
  });
  return null;
}

/** Tells the page the first frame is on screen, so it can fade the canvas in over the poster. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => onReady?.());
  });
  return null;
}

export default function ArcScene({ progress, active, lite = false, idle = false, onReady }: { progress?: RefObject<number>; active: boolean; lite?: boolean; idle?: boolean; onReady?: () => void }) {
  const curve = useArc(lite);
  const end = useMemo(() => curve.getPointAt(1), [curve]);
  const t = useRef(0.02);
  // Start sharp, step resolution down if the device can't hold frame rate.
  const [dpr, setDpr] = useState(lite ? 1.25 : 1.75);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows={!lite}
      dpr={dpr}
      camera={{ position: [-3.2, 1.6, 9.5], fov: lite ? 55 : 38 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(0.75, d - 0.5))} onIncline={() => setDpr((d) => Math.min(lite ? 1.5 : 2, d + 0.25))} />
      <ReadySignal onReady={onReady} />
      <color attach="background" args={[NIGHT]} />
      <fog attach="fog" args={[NIGHT, 12, 34]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[0, 14, 4]} angle={0.5} penumbra={1} intensity={220} color="#dfe6ff" castShadow />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 6, 2]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={3} color="#3b5bff" position={[-6, 2, 0]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.4} color="#ff7a45" position={[6, 2, -2]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1.6} color="#8ea0ff" position={[0, 3, -6]} scale={3} />
      </Environment>

      <Driver progress={progress} t={t} idle={idle} />
      <Rig t={t} lite={lite} />
      <Floor lite={lite} />
      <Trajectory curve={curve} t={t} />
      <Target at={end} t={t} />
      <Ball curve={curve} t={t} />
      <Float speed={1} floatIntensity={0.4} rotationIntensity={0}>
        <Sparkles count={lite ? 30 : 70} scale={[16, 7, 8]} position={[0, 3.5, -1]} size={1.6} speed={0.25} opacity={0.45} color="#c9d3ff" />
      </Float>

      {!lite && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
