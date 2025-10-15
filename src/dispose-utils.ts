import * as THREE from 'three';

export const disposeMaterials = (
  material: THREE.Material | Array<THREE.Material>
): void => {
  if ((material as THREE.Material).isMaterial) {
    const mat = material as THREE.Material;
    (mat as any).map?.dispose();
    (mat as any).map = null;
    mat.dispose();
  } else {
    (material as Array<THREE.Material>).forEach(disposeMaterials);
  }
};

export const deepDispose = (container: THREE.Mesh): void => {
  const { isMesh, material, geometry } = container;
  if (isMesh) {
    if (material) {
      disposeMaterials(material);
      (container as any).material = null;
    }

    if (geometry) {
      geometry.dispose();
      (container as any).geometry = null;
    }
    container.parent?.remove(container);
  } else if ((container as any).children) {
    (container as any).children.forEach(deepDispose);
    container.parent?.remove(container);
  }
};
