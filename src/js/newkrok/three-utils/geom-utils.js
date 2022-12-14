export const sign = (point1, point2, point3) =>
  (point1.x - point3.x) * (point2.z - point3.z) -
  (point2.x - point3.x) * (point1.z - point3.z);

export const isPointInATriangle = (
  point,
  trianglePointA,
  trianglePointB,
  trianglePointC
) => {
  const d1 = sign(point, trianglePointA, trianglePointB);
  const d2 = sign(point, trianglePointB, trianglePointC);
  const d3 = sign(point, trianglePointC, trianglePointA);

  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
};

export const yFromTriangle = (
  point,
  trianglePointA,
  trianglePointB,
  trianglePointC
) => {
  const calc1 =
    (trianglePointB.x - trianglePointA.x) *
      (trianglePointC.y - trianglePointA.y) -
    (trianglePointC.x - trianglePointA.x) *
      (trianglePointB.y - trianglePointA.y);
  const calc2 =
    (trianglePointB.x - trianglePointA.x) *
      (trianglePointC.z - trianglePointA.z) -
    (trianglePointC.x - trianglePointA.x) *
      (trianglePointB.z - trianglePointA.z);
  const calc3 =
    (trianglePointB.z - trianglePointA.z) *
      (trianglePointC.y - trianglePointA.y) -
    (trianglePointC.z - trianglePointA.z) *
      (trianglePointB.y - trianglePointA.y);
  const calc4 =
    (trianglePointB.x - trianglePointA.x) *
      (trianglePointC.z - trianglePointA.z) -
    (trianglePointC.x - trianglePointA.x) *
      (trianglePointB.z - trianglePointA.z);

  return (
    trianglePointA.y +
    (calc1 / calc2) * (point.z - trianglePointA.z) -
    (calc3 / calc4) * (point.x - trianglePointA.x)
  );
};
