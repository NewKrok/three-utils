export function sign(
  point1: THREE.Vector3,
  point2: THREE.Vector3,
  point3: THREE.Vector3
): number;
export function isPointInATriangle(
  point: THREE.Vector3,
  trianglePointA: THREE.Vector3,
  trianglePointB: THREE.Vector3,
  trianglePointC: THREE.Vector3
): boolean;
export function yFromTriangle(
  point: THREE.Vector3,
  trianglePointA: THREE.Vector3,
  trianglePointB: THREE.Vector3,
  trianglePointC: THREE.Vector3
): number;
