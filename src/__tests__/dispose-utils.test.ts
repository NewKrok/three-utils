import { disposeMaterials, deepDispose } from '../dispose-utils.js';

// Mock Three.js objects with proper type casting
const createMockMaterial = (hasMap = false): any => ({
    isMaterial: true,
    map: hasMap ? { dispose: jest.fn() } : null,
    dispose: jest.fn(),
});

const createMockGeometry = (): any => ({
    dispose: jest.fn(),
});

const createMockMesh = (hasMaterial = true, hasGeometry = true): any => ({
    isMesh: true,
    material: hasMaterial ? createMockMaterial() : null,
    geometry: hasGeometry ? createMockGeometry() : null,
    parent: {
        remove: jest.fn(),
    },
});

const createMockObject3D = (children: any[] = []): any => ({
    children,
    parent: {
        remove: jest.fn(),
    },
});

describe('DisposeUtils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('disposeMaterials', () => {
        it('should dispose single material without map', () => {
            const material = createMockMaterial();

            disposeMaterials(material as any);

            expect(material.dispose).toHaveBeenCalledTimes(1);
        });

        it('should dispose single material with map', () => {
            const material = createMockMaterial(true);
            const mapDisposeSpy = material.map!.dispose;

            disposeMaterials(material as any);

            expect(mapDisposeSpy).toHaveBeenCalledTimes(1);
            expect(material.map).toBeNull();
            expect(material.dispose).toHaveBeenCalledTimes(1);
        });

        it('should dispose array of materials', () => {
            const material1 = createMockMaterial();
            const material2 = createMockMaterial(true);
            const material2MapDispose = material2.map!.dispose;
            const materials = [material1, material2];

            disposeMaterials(materials as any);

            expect(material1.dispose).toHaveBeenCalledTimes(1);
            expect(material2MapDispose).toHaveBeenCalledTimes(1);
            expect(material2.dispose).toHaveBeenCalledTimes(1);
            expect(material2.map).toBeNull();
        });

        it('should handle nested arrays of materials', () => {
            const material1 = createMockMaterial();
            const material2 = createMockMaterial(true);
            const material2MapDispose = material2.map!.dispose;
            const nestedMaterials = [[material1], [material2]];

            disposeMaterials(nestedMaterials as any);

            expect(material1.dispose).toHaveBeenCalledTimes(1);
            expect(material2MapDispose).toHaveBeenCalledTimes(1);
            expect(material2.dispose).toHaveBeenCalledTimes(1);
        });
    });

    describe('deepDispose', () => {
        it('should dispose mesh with material and geometry', () => {
            const mesh = createMockMesh();
            const materialDispose = mesh.material!.dispose;
            const geometryDispose = mesh.geometry!.dispose;

            deepDispose(mesh as any);

            expect(materialDispose).toHaveBeenCalledTimes(1);
            expect(geometryDispose).toHaveBeenCalledTimes(1);
            expect(mesh.material).toBeNull();
            expect(mesh.geometry).toBeNull();
            expect(mesh.parent.remove).toHaveBeenCalledWith(mesh);
        });

        it('should dispose mesh with material that has map', () => {
            const mesh = {
                isMesh: true,
                material: createMockMaterial(true),
                geometry: createMockGeometry(),
                parent: {
                    remove: jest.fn(),
                },
            };
            const materialMapDispose = mesh.material.map!.dispose;
            const materialDispose = mesh.material.dispose;
            const geometryDispose = mesh.geometry.dispose;

            deepDispose(mesh as any);

            expect(materialMapDispose).toHaveBeenCalledTimes(1);
            expect(materialDispose).toHaveBeenCalledTimes(1);
            expect(geometryDispose).toHaveBeenCalledTimes(1);
            expect(mesh.parent.remove).toHaveBeenCalledWith(mesh);
        });

        it('should dispose mesh with array of materials', () => {
            const material1 = createMockMaterial();
            const material2 = createMockMaterial(true);
            const material2MapDispose = material2.map!.dispose;
            const mesh = {
                isMesh: true,
                material: [material1, material2],
                geometry: createMockGeometry(),
                parent: {
                    remove: jest.fn(),
                },
            };
            const geometryDispose = mesh.geometry.dispose;

            deepDispose(mesh as any);

            expect(material1.dispose).toHaveBeenCalledTimes(1);
            expect(material2MapDispose).toHaveBeenCalledTimes(1);
            expect(material2.dispose).toHaveBeenCalledTimes(1);
            expect(geometryDispose).toHaveBeenCalledTimes(1);
            expect(mesh.parent.remove).toHaveBeenCalledWith(mesh);
        });

        it('should handle mesh without material', () => {
            const mesh = createMockMesh(false, true);
            const geometryDispose = mesh.geometry!.dispose;

            deepDispose(mesh as any);

            expect(geometryDispose).toHaveBeenCalledTimes(1);
            expect(mesh.parent.remove).toHaveBeenCalledWith(mesh);
        });

        it('should handle mesh without geometry', () => {
            const mesh = createMockMesh(true, false);
            const materialDispose = mesh.material!.dispose;

            deepDispose(mesh as any);

            expect(materialDispose).toHaveBeenCalledTimes(1);
            expect(mesh.parent.remove).toHaveBeenCalledWith(mesh);
        });

        it('should recursively dispose children in Object3D', () => {
            const childMesh1 = createMockMesh();
            const childMesh2 = createMockMesh();
            const child1MaterialDispose = childMesh1.material!.dispose;
            const child1GeometryDispose = childMesh1.geometry!.dispose;
            const child2MaterialDispose = childMesh2.material!.dispose;
            const child2GeometryDispose = childMesh2.geometry!.dispose;
            const container = createMockObject3D([childMesh1, childMesh2]);

            deepDispose(container as any);

            expect(child1MaterialDispose).toHaveBeenCalledTimes(1);
            expect(child1GeometryDispose).toHaveBeenCalledTimes(1);
            expect(child2MaterialDispose).toHaveBeenCalledTimes(1);
            expect(child2GeometryDispose).toHaveBeenCalledTimes(1);
            expect(container.parent.remove).toHaveBeenCalledWith(container);
        });

        it('should handle nested container hierarchy', () => {
            const mesh = createMockMesh();
            const materialDispose = mesh.material!.dispose;
            const geometryDispose = mesh.geometry!.dispose;
            const subContainer = createMockObject3D([mesh]);
            const mainContainer = createMockObject3D([subContainer]);

            deepDispose(mainContainer as any);

            expect(materialDispose).toHaveBeenCalledTimes(1);
            expect(geometryDispose).toHaveBeenCalledTimes(1);
            expect(subContainer.parent.remove).toHaveBeenCalledWith(subContainer);
            expect(mainContainer.parent.remove).toHaveBeenCalledWith(mainContainer);
        });

        it('should handle container without parent', () => {
            const mesh = createMockMesh();
            const materialDispose = mesh.material!.dispose;
            const geometryDispose = mesh.geometry!.dispose;
            mesh.parent = null;

            expect(() => deepDispose(mesh as any)).not.toThrow();
            expect(materialDispose).toHaveBeenCalledTimes(1);
            expect(geometryDispose).toHaveBeenCalledTimes(1);
        });

        it('should handle empty container', () => {
            const container = createMockObject3D([]);

            expect(() => deepDispose(container as any)).not.toThrow();
            expect(container.parent.remove).toHaveBeenCalledWith(container);
        });
    });
});