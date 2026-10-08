import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { ARC_CYAN, ARC_LIME } from "./arc";

/** Many athletes, many arcs, one placement: dozens of trajectories converging on a target. */
function Arcs({ count = 26 }: { count?: number }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.2, -2), []);
  const arcs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = 7 + Math.random() * 4;
        const start = new THREE.Vector3(Math.cos(a) * r, -2.5, Math.sin(a) * r * 0.5 + 1);
        const mid = start.clone().lerp(target, 0.5);
        mid.y += 3 + Math.random() * 2.5;
        const curve = new THREE.QuadraticBezierCurve3(start, mid, target);
        return {
          curve,
          line: new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
          offset: Math.random(),
          speed: 0.12 + Math.random() * 0.1,
          color: new THREE.Color().copy(ARC_CYAN).lerp(ARC_LIME, Math.random()),
        };
      }),
    [count, target]
  );
  const balls = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    arcs.forEach((a, i) => {
      const t = (clock.elapsedTime * a.speed + a.offset) % 1;
      dummy.position.copy(a.curve.getPoint(t));
      dummy.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.8);
      dummy.updateMatrix();
      balls.current!.setMatrixAt(i, dummy.matrix);
      balls.current!.setColorAt(i, a.color);
    });
    balls.current!.instanceMatrix.needsUpdate = true;
    if (balls.current!.instanceColor) balls.current!.instanceColor.needsUpdate = true;
  });
  return (
    <group>
      {arcs.map((a, i) => (
        <line key={i}>
          <primitive object={a.line} attach="geometry" />
          <lineBasicMaterial color={a.color} transparent opacity={0.16} />
        </line>
      ))}
      <instancedMesh ref={balls} args={[undefined, undefined, arcs.length]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <mesh position={target}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshBasicMaterial color={ARC_LIME} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Spin({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    g.current!.rotation.y += dt * 0.06;
    g.current!.rotation.x = THREE.MathUtils.lerp(g.current!.rotation.x, s.pointer.y * 0.15, 0.05);
  });
  return <group ref={g}>{children}</group>;
}

export default function LaunchScene({ active, lite }: { active: boolean; lite: boolean }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, lite ? 1.5 : 2]} camera={{ position: [0, 2.5, 10], fov: 45 }} gl={{ alpha: true }}>
      <Spin>
        <Arcs count={lite ? 16 : 30} />
      </Spin>
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.4} luminanceThreshold={0.1} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
