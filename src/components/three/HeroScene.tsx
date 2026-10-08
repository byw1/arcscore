import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Trail, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { makeArcCurve, ARC_CYAN, ARC_LIME } from "./arc";

/* ---------- Field: a perspective "yard-line" grid that fades into the dark ---------- */
function Field() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv; varying vec3 vPos;
          void main(){ vUv = uv; vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uTime; varying vec3 vPos;
          float line(float x, float w){ float d = abs(fract(x - 0.5) - 0.5) / fwidth(x); return 1.0 - min(d / w, 1.0); }
          void main(){
            vec2 p = vPos.xy;
            float minor = line(p.x * 1.0, 1.0) * 0.18 + line(p.y * 1.0, 1.0) * 0.10;
            float major = line(p.x / 5.0, 1.2) * 0.55;
            float fade = smoothstep(18.0, 2.0, length(p));
            float scan = smoothstep(0.0, 1.0, 1.0 - abs(fract(p.y * 0.08 - uTime * 0.06) - 0.5) * 6.0) * 0.35;
            vec3 col = mix(vec3(0.35,0.82,1.0), vec3(0.78,1.0,0.24), smoothstep(-8.0, 8.0, p.x));
            float a = (minor + major + scan * major) * fade;
            gl_FragColor = vec4(col, a * 0.55);
          }`,
      }),
    []
  );
  useFrame((_, dt) => (mat.uniforms.uTime.value += dt));
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 0]} material={mat}>
      <planeGeometry args={[60, 60, 1, 1]} />
    </mesh>
  );
}

/* ---------- Glowing trajectory tube with a travelling energy pulse ---------- */
function ArcTube({ curve }: { curve: THREE.Curve<THREE.Vector3> }) {
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 240, 0.035, 12, false), [curve]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uA: { value: ARC_CYAN }, uB: { value: ARC_LIME } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          uniform float uTime; uniform vec3 uA; uniform vec3 uB; varying vec2 vUv;
          void main(){
            float t = vUv.x;
            float pulse = smoothstep(0.12, 0.0, abs(fract(uTime * 0.18) - t)) * 2.2;
            float dash = step(0.5, fract(t * 90.0 - uTime * 1.5)) * 0.25 + 0.75;
            vec3 col = mix(uA, uB, t);
            float a = (0.55 + pulse) * dash * smoothstep(0.0, 0.04, t) * smoothstep(1.0, 0.94, t);
            gl_FragColor = vec4(col * (1.0 + pulse), a);
          }`,
      }),
    []
  );
  useFrame((_, dt) => (mat.uniforms.uTime.value += dt));
  return <mesh geometry={geo} material={mat} />;
}

/* ---------- The ball: rides the arc, leaves a trail ---------- */
function Ball({ curve, speed = 0.11 }: { curve: THREE.Curve<THREE.Vector3>; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current = (t.current + dt * speed) % 1;
    const eased = t.current < 0.92 ? t.current / 0.92 : 1;
    const p = curve.getPointAt(Math.min(eased, 0.999));
    ref.current!.position.copy(p);
    ref.current!.rotation.x += dt * 6;
    ref.current!.rotation.z += dt * 2;
    ref.current!.scale.setScalar(t.current > 0.92 ? Math.max(0.001, 1 - (t.current - 0.92) * 12) : 1);
  });
  return (
    <Trail width={1.4} length={7} color={ARC_LIME} attenuation={(w) => w * w} decay={1.4}>
      <group ref={ref}>
        <mesh scale={[1.28, 0.82, 0.82]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color="#ff8a4c" emissive="#ff7a3d" emissiveIntensity={2.2} roughness={0.3} />
        </mesh>
        <mesh scale={[1.3, 0.83, 0.83]}>
          <torusGeometry args={[0.13, 0.008, 8, 48]} />
          <meshBasicMaterial color="#fff2e0" />
        </mesh>
      </group>
    </Trail>
  );
}

/* ---------- Target: concentric score rings where the arc lands ---------- */
function Target({ position }: { position: THREE.Vector3 }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    g.current!.children.forEach((c, i) => {
      c.rotation.z = t * (0.2 + i * 0.12) * (i % 2 ? -1 : 1);
      const s = 1 + Math.sin(t * 2 - i) * 0.03;
      c.scale.set(s, s, s);
    });
  });
  return (
    <group position={position} rotation={[-Math.PI / 2.4, 0, 0]}>
      <group ref={g}>
        {[0.35, 0.62, 0.9, 1.2].map((r, i) => (
          <mesh key={r}>
            <ringGeometry args={[r, r + (i === 0 ? 0.04 : 0.018), 96, 1, 0, Math.PI * (i === 3 ? 1.6 : 2)]} />
            <meshBasicMaterial color={i % 2 ? ARC_CYAN : ARC_LIME} transparent opacity={0.9 - i * 0.15} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh>
        <circleGeometry args={[0.16, 48]} />
        <meshBasicMaterial color={ARC_LIME} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- Athlete constellation: every point is a scored athlete ---------- */
function Constellation({ count = 1600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 16;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.6 - 1;
      positions[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 6;
      const score = Math.pow(Math.random(), 2.4); // most athletes are undiscovered
      c.copy(ARC_CYAN).lerp(ARC_LIME, score);
      colors.set([c.r, c.g, c.b], i * 3);
      sizes[i] = 0.4 + score * 2.2;
    }
    return { positions, colors, sizes };
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms: { uTime: { value: 0 }, uPR: { value: Math.min(window.devicePixelRatio, 2) } },
        vertexShader: `
          attribute float aSize; uniform float uTime; uniform float uPR; varying vec3 vColor; varying float vTw;
          void main(){
            vColor = color;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vTw = 0.6 + 0.4 * sin(uTime * 1.5 + position.x * 3.0 + position.z);
            gl_PointSize = aSize * uPR * (18.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vColor; varying float vTw;
          void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vColor, a * a * vTw); }`,
      }),
    []
  );
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    ref.current!.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref} material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
    </points>
  );
}

/* ---------- Data pillars rising along the arc: the signals that make the score ---------- */
function SignalPillars({ curve }: { curve: THREE.Curve<THREE.Vector3> }) {
  const group = useRef<THREE.Group>(null);
  const pts = useMemo(() => [0.12, 0.26, 0.4, 0.55, 0.7, 0.84].map((t) => curve.getPointAt(t)), [curve]);
  useFrame(({ clock }) => {
    group.current!.children.forEach((m, i) => {
      const h = 0.5 + (Math.sin(clock.elapsedTime * 1.2 + i * 1.3) * 0.5 + 0.5) * (0.6 + i * 0.25);
      m.scale.y = h;
      m.position.y = -1.9 + h / 2;
    });
  });
  return (
    <group ref={group}>
      {pts.map((p, i) => (
        <mesh key={i} position={[p.x, -1.4, p.z]}>
          <boxGeometry args={[0.06, 1, 0.06]} />
          <meshBasicMaterial color={i % 2 ? ARC_CYAN : ARC_LIME} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Camera rig: pointer parallax + scroll dolly ---------- */
function Rig({ progress }: { progress: React.RefObject<number> }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.6, 0), []);
  useFrame((_, dt) => {
    const p = progress.current ?? 0;
    const k = 1 - Math.exp(-dt * 3);
    camera.position.x += (pointer.x * 1.4 - camera.position.x + p * 2) * k;
    camera.position.y += (1.2 + pointer.y * 0.8 + p * 2.4 - camera.position.y) * k;
    camera.position.z += (9.5 - p * 2.5 - camera.position.z) * k;
    camera.lookAt(target);
  });
  return null;
}

export default function HeroScene({ progress, active, lite }: { progress: React.RefObject<number>; active: boolean; lite: boolean }) {
  const curve = useMemo(() => makeArcCurve(lite ? 7.5 : 11, lite ? 3.8 : 4.6), [lite]);
  const end = useMemo(() => curve.getPointAt(1), [curve]);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, lite ? 1.5 : 2]}
      camera={{ position: [0, 1.2, 9.5], fov: lite ? 60 : 42 }}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 4]} intensity={30} color="#ffd9b8" />
      <Rig progress={progress} />
      <Constellation count={lite ? 700 : 1600} />
      <Field />
      <ArcTube curve={curve} />
      <SignalPillars curve={curve} />
      <Ball curve={curve} />
      <Target position={end} />
      <Float speed={1.4} floatIntensity={0.6}>
        <Sparkles count={lite ? 30 : 70} scale={[12, 5, 6]} size={2.2} speed={0.35} color="#c6ff3d" opacity={0.6} />
      </Float>
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
