export const disposeMaterials = (material) => {
  if (material.isMaterial) {
    material.map?.dispose();
    material.map = null;
    material.dispose();
  } else {
    material.forEach(disposeMaterials);
  }
};

export const deepDispose = (container) => {
  const { isMesh, material, geometry } = container;
  if (isMesh) {
    if (material) {
      disposeMaterials(material);
      container.material = null;
    }

    if (geometry) {
      geometry.dispose();
      container.geometry = null;
    }
    container.parent?.remove(container);
  } else if (container.children) {
    container.children.forEach(deepDispose);
    container.parent?.remove(container);
  }
};
