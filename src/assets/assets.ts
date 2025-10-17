import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { deepDispose } from '../dispose-utils.js';
import {
  loadAudio,
  loadFBXModels,
  loadGLTFModels,
  loadTextures,
} from './loaders.js';

// Type definitions
export type FBXModelEntry = {
  id: string;
  fbxModel: THREE.Group;
  material?: MaterialConfig | MaterialConfig[];
};

export type GLTFModelEntry = {
  id: string;
  gltfModel: GLTF;
  material?: MaterialConfig | MaterialConfig[];
};

export type TextureEntry = {
  id: string;
  texture: THREE.Texture;
};

export type AudioBufferEntry = {
  id: string;
  audioBuffer: AudioBuffer;
};

export type MaterialConfig = {
  materialType?: new (params: any) => THREE.Material;
  texture?: {
    id: string;
    flipY?: boolean;
  };
  color?: number;
  alphaTest?: number;
};

export type LoadAssetsParams = {
  textures: Array<{ id: string; url: string }>;
  gltfModels: Array<{
    id: string;
    url: string;
    material?: MaterialConfig | MaterialConfig[];
  }>;
  fbxModels: Array<{
    id: string;
    url: string;
    material?: MaterialConfig | MaterialConfig[];
  }>;
  fbxSkeletonAnimations: Array<{ id: string; url: string }>;
  audio: Array<{ id: string; url: string }>;
  onProgress?: (progress: number) => void;
  verbose?: boolean;
};

// Asset registries
const _fbxModels: Record<string, THREE.Group> = {};
const _gltfModels: Record<string, GLTF> = {};
const _textures: Record<string, THREE.Texture> = {};
const _audioBuffers: Record<string, AudioBuffer> = {};
const fbxSkeletonAnimations: Record<string, THREE.AnimationClip> = {};

// FBX Model functions
export const registerFBXModel = ({
  id,
  fbxModel,
}: {
  id: string;
  fbxModel: THREE.Group;
}): void => {
  _fbxModels[id] = fbxModel;
};

export const getFBXModel = (id: string): THREE.Group => {
  const clonedModel = clone(_fbxModels[id]) as THREE.Group;
  clonedModel.animations = [..._fbxModels[id].animations];
  return clonedModel;
};

// FBX Skeleton Animation functions
export const registerFBXSkeletonAnimation = ({
  id,
  fbxModel,
}: {
  id: string;
  fbxModel: THREE.Group;
}): void => {
  fbxSkeletonAnimations[id] = fbxModel.animations[0];
};

export const getFBXSkeletonAnimation = (id: string): THREE.AnimationClip => {
  return fbxSkeletonAnimations[id];
};

// GLTF Model functions
export const registerGLTFModel = ({
  id,
  gltfModel,
}: {
  id: string;
  gltfModel: GLTF;
}): void => {
  _gltfModels[id] = gltfModel;
};

export const getGLTFModel = (id: string): GLTF => {
  return _gltfModels[id];
};

// Texture functions
export const registerTexture = ({
  id,
  texture,
}: {
  id: string;
  texture: THREE.Texture;
}): void => {
  _textures[id] = texture;
};

export const getTexture = (id: string): THREE.Texture | null => {
  return _textures[id] || null;
};

// Audio Buffer functions
export const registerAudioBuffer = ({
  id,
  audioBuffer,
}: {
  id: string;
  audioBuffer: AudioBuffer;
}): void => {
  _audioBuffers[id] = audioBuffer;
};

export const getAudioBuffer = (id: string): AudioBuffer | null => {
  return _audioBuffers[id] || null;
};

// Material helper functions
const applyMaterialConfig = ({
  material,
  materialConfig = { texture: { id: '' }, color: 0xffffff, alphaTest: 0.5 },
}: {
  material: THREE.Material;
  materialConfig?: MaterialConfig;
}): void => {
  if ('map' in material) {
    (material as any).map = materialConfig?.texture?.id
      ? getTexture(materialConfig.texture.id)
      : null;
  }
  if ('alphaTest' in material) {
    (material as any).alphaTest = materialConfig?.alphaTest || 0.5;
  }
  if ('color' in material) {
    (material as any).color = new THREE.Color(
      materialConfig?.color || 0xffffff
    );
  }
};

const createMaterial = (
  materialConfig: MaterialConfig | MaterialConfig[] = {
    materialType: undefined,
    texture: { id: '', flipY: true },
    color: 0xffffff,
    alphaTest: 0.5,
  }
): THREE.Material | THREE.Material[] | null => {
  let material: THREE.Material | THREE.Material[] | null = null;

  if (materialConfig instanceof Array) {
    material = materialConfig.map(
      (config) => createMaterial(config) as THREE.Material
    );
  } else if (materialConfig.materialType) {
    const map = materialConfig?.texture?.id
      ? getTexture(materialConfig.texture.id)
      : null;
    if (map) {
      map.flipY = materialConfig?.texture?.flipY ?? true;
    }
    material = new materialConfig.materialType({
      map,
      alphaTest: materialConfig.alphaTest || 0.5,
      color: new THREE.Color(materialConfig?.color || 0xffffff),
    });
  }
  return material;
};

// Asset disposal
export const disposeAssets = (): void => {
  Object.entries(_textures).forEach(([key, texture]) => {
    texture.dispose();
    delete _textures[key];
  });
  Object.entries(_fbxModels).forEach(([key, fbxModel]) => {
    deepDispose(fbxModel);
    delete _fbxModels[key];
  });
  Object.entries(_gltfModels).forEach(([key, gltfModel]) => {
    deepDispose(gltfModel.scene);
    delete _gltfModels[key];
  });
};

// Main asset loading function
export const loadAssets = ({
  textures,
  gltfModels,
  fbxModels,
  fbxSkeletonAnimations,
  audio,
  onProgress,
  verbose = true,
}: LoadAssetsParams): Promise<{ fbxModels: FBXModelEntry[] }> =>
  new Promise((resolve) => {
    const result: { fbxModels: FBXModelEntry[] } = { fbxModels: [] };
    const assetCount =
      textures.length +
      gltfModels.length +
      fbxModels.length +
      fbxSkeletonAnimations.length +
      audio.length;
    let loadedCount = 0;
    const updateProgress = (): void => {
      loadedCount++;
      onProgress && onProgress(loadedCount / assetCount);
    };

    loadTextures(textures, updateProgress)
      .then((loadedTextures: TextureEntry[]) => {
        loadedTextures.forEach((element) => {
          element.texture.colorSpace = THREE.SRGBColorSpace;
          registerTexture(element);
        });
        if (verbose) {
          console.log(`Textures(${loadedTextures.length}) are loaded...`);
        }

        loadGLTFModels(gltfModels, updateProgress).then(
          (loadedModels: GLTFModelEntry[]) => {
            loadedModels.forEach((element) => {
              const createdMaterial = createMaterial(element.material);
              let textureIndex = 0;
              element.gltfModel.scene.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  const mesh = child as THREE.Mesh;
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;
                  if (mesh.material instanceof Array) {
                    mesh.material = createdMaterial as THREE.Material[];
                  } else {
                    mesh.material =
                      createdMaterial instanceof Array
                        ? createdMaterial[textureIndex]
                        : (createdMaterial as THREE.Material) || mesh.material;
                  }
                  if (!createdMaterial && element.material) {
                    applyMaterialConfig({
                      material: mesh.material as THREE.Material,
                      materialConfig:
                        element.material instanceof Array
                          ? element.material[textureIndex]
                          : element.material,
                    });
                  }
                  textureIndex++;
                }
              });
              registerGLTFModel(element);
            });
            if (verbose) {
              console.log(`GLTF Models(${loadedModels.length}) are loaded...`);
            }

            loadFBXModels(fbxSkeletonAnimations, updateProgress).then(
              (loadedAnimations: FBXModelEntry[]) => {
                loadedAnimations.forEach((element) => {
                  registerFBXSkeletonAnimation(element);
                });
                if (verbose) {
                  console.log(
                    `FBX Skeleton Animations(${loadedAnimations.length}) are loaded...`
                  );
                }

                loadFBXModels(fbxModels, updateProgress)
                  .then((loadedModels: FBXModelEntry[]) => {
                    loadedModels.forEach((element) => {
                      const createdMaterial = createMaterial(element.material);
                      let textureIndex = 0;
                      element.fbxModel.traverse((child) => {
                        if ((child as THREE.Mesh).isMesh) {
                          const mesh = child as THREE.Mesh;
                          mesh.castShadow = true;
                          mesh.receiveShadow = true;
                          if (mesh.material instanceof Array) {
                            mesh.material = createdMaterial as THREE.Material[];
                          } else {
                            mesh.material =
                              createdMaterial instanceof Array
                                ? createdMaterial[textureIndex]
                                : (createdMaterial as THREE.Material) ||
                                  mesh.material;
                          }
                          if (!createdMaterial && element.material) {
                            applyMaterialConfig({
                              material: mesh.material as THREE.Material,
                              materialConfig:
                                element.material instanceof Array
                                  ? element.material[textureIndex]
                                  : element.material,
                            });
                          }
                          textureIndex++;
                        }
                      });
                      registerFBXModel(element);
                    });
                    result.fbxModels = [...loadedModels];
                    if (verbose) {
                      console.log(
                        `FBX Models(${loadedModels.length}) are loaded...`
                      );
                    }

                    loadAudio(audio, updateProgress)
                      .then((loadedAudio: AudioBufferEntry[]) => {
                        loadedAudio.forEach((element) =>
                          registerAudioBuffer(element)
                        );
                        if (verbose) {
                          console.log(
                            `Audio files(${loadedAudio.length}) are loaded...`
                          );
                        }
                        resolve(result);
                      })
                      .catch((error: unknown) =>
                        console.error(
                          `Fatal error during Audio files preloader phase: ${error}`
                        )
                      );
                  })
                  .catch((error: unknown) =>
                    console.error(
                      `Fatal error during FBX model preloader phase: ${error}`
                    )
                  );
              }
            );
          }
        );
      })
      .catch((error: unknown) =>
        console.error(`Fatal error during texture preloader phase: ${error}`)
      );
  });
