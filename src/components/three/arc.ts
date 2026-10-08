import * as THREE from "three";

/** The ArcScore trajectory: launch (athlete) → apex (momentum) → target (placement). */
export function makeArcCurve(span = 11, height = 4.6, depth = -1.5) {
  const start = new THREE.Vector3(-span / 2, -1.6, 1.2);
  const end = new THREE.Vector3(span / 2, -1.2, depth);
  const c1 = new THREE.Vector3(-span / 6, height, 0.6);
  const c2 = new THREE.Vector3(span / 5, height * 0.95, depth * 0.4);
  return new THREE.CubicBezierCurve3(start, c1, c2, end);
}

export const ARC_LIME = new THREE.Color("#c6ff3d");
export const ARC_CYAN = new THREE.Color("#5ad1ff");
export const ARC_EMBER = new THREE.Color("#ff7a3d");
