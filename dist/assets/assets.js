import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { deepDispose } from '../dispose-utils.js';
import { loadAudio, loadFBXModels, loadGLTFModels, loadTextures, } from './loaders.js';
// Asset registries
const _fbxModels = {};
const _gltfModels = {};
const _textures = {};
const _audioBuffers = {};
const fbxSkeletonAnimations = {};
// FBX Model functions
export const registerFBXModel = ({ id, fbxModel }) => {
    _fbxModels[id] = fbxModel;
};
export const getFBXModel = (id) => {
    const clonedModel = clone(_fbxModels[id]);
    clonedModel.animations = [..._fbxModels[id].animations];
    return clonedModel;
};
// FBX Skeleton Animation functions
export const registerFBXSkeletonAnimation = ({ id, fbxModel }) => {
    fbxSkeletonAnimations[id] = fbxModel.animations[0];
};
export const getFBXSkeletonAnimation = (id) => {
    return fbxSkeletonAnimations[id];
};
// GLTF Model functions
export const registerGLTFModel = ({ id, gltfModel }) => {
    _gltfModels[id] = gltfModel;
};
export const getGLTFModel = (id) => {
    return _gltfModels[id];
};
// Texture functions
export const registerTexture = ({ id, texture }) => {
    _textures[id] = texture;
};
export const getTexture = (id) => {
    return _textures[id] || null;
};
// Audio Buffer functions
export const registerAudioBuffer = ({ id, audioBuffer }) => {
    _audioBuffers[id] = audioBuffer;
};
export const getAudioBuffer = (id) => {
    return _audioBuffers[id] || null;
};
// Material helper functions
const applyMaterialConfig = ({ material, materialConfig = { texture: { id: '' }, color: 0xffffff, alphaTest: 0.5 }, }) => {
    if ('map' in material) {
        material.map = materialConfig?.texture?.id
            ? getTexture(materialConfig.texture.id)
            : null;
    }
    if ('alphaTest' in material) {
        material.alphaTest = materialConfig?.alphaTest || 0.5;
    }
    if ('color' in material) {
        material.color = new THREE.Color(materialConfig?.color || 0xffffff);
    }
};
const createMaterial = (materialConfig = {
    materialType: undefined,
    texture: { id: '', flipY: true },
    color: 0xffffff,
    alphaTest: 0.5,
}) => {
    let material = null;
    if (materialConfig instanceof Array) {
        material = materialConfig.map((config) => createMaterial(config));
    }
    else if (materialConfig.materialType) {
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
export const disposeAssets = () => {
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
export const loadAssets = ({ textures, gltfModels, fbxModels, fbxSkeletonAnimations, audio, onProgress, verbose = true, }) => new Promise((resolve) => {
    const result = { fbxModels: [] };
    const assetCount = textures.length +
        gltfModels.length +
        fbxModels.length +
        fbxSkeletonAnimations.length +
        audio.length;
    let loadedCount = 0;
    const updateProgress = () => {
        loadedCount++;
        onProgress && onProgress(loadedCount / assetCount);
    };
    loadTextures(textures, updateProgress)
        .then((loadedTextures) => {
        loadedTextures.forEach((element) => {
            element.texture.colorSpace = THREE.SRGBColorSpace;
            registerTexture(element);
        });
        if (verbose) {
            console.log(`Textures(${loadedTextures.length}) are loaded...`);
        }
        loadGLTFModels(gltfModels, updateProgress)
            .then((loadedModels) => {
            loadedModels.forEach((element) => {
                const createdMaterial = createMaterial(element.material);
                let textureIndex = 0;
                element.gltfModel.scene.traverse((child) => {
                    if (child.isMesh) {
                        const mesh = child;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        if (mesh.material instanceof Array) {
                            mesh.material = createdMaterial;
                        }
                        else {
                            mesh.material =
                                createdMaterial instanceof Array
                                    ? createdMaterial[textureIndex]
                                    : createdMaterial || mesh.material;
                        }
                        if (!createdMaterial && element.material) {
                            applyMaterialConfig({
                                material: mesh.material,
                                materialConfig: element.material instanceof Array
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
            loadFBXModels(fbxSkeletonAnimations, updateProgress)
                .then((loadedAnimations) => {
                loadedAnimations.forEach((element) => {
                    registerFBXSkeletonAnimation(element);
                });
                if (verbose) {
                    console.log(`FBX Skeleton Animations(${loadedAnimations.length}) are loaded...`);
                }
                loadFBXModels(fbxModels, updateProgress)
                    .then((loadedModels) => {
                    loadedModels.forEach((element) => {
                        const createdMaterial = createMaterial(element.material);
                        let textureIndex = 0;
                        element.fbxModel.traverse((child) => {
                            if (child.isMesh) {
                                const mesh = child;
                                mesh.castShadow = true;
                                mesh.receiveShadow = true;
                                if (mesh.material instanceof Array) {
                                    mesh.material = createdMaterial;
                                }
                                else {
                                    mesh.material =
                                        createdMaterial instanceof Array
                                            ? createdMaterial[textureIndex]
                                            : createdMaterial || mesh.material;
                                }
                                if (!createdMaterial && element.material) {
                                    applyMaterialConfig({
                                        material: mesh.material,
                                        materialConfig: element.material instanceof Array
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
                        console.log(`FBX Models(${loadedModels.length}) are loaded...`);
                    }
                    loadAudio(audio, updateProgress)
                        .then((loadedAudio) => {
                        loadedAudio.forEach((element) => registerAudioBuffer(element));
                        if (verbose) {
                            console.log(`Audio files(${loadedAudio.length}) are loaded...`);
                        }
                        resolve(result);
                    })
                        .catch((error) => console.error(`Fatal error during Audio files preloader phase: ${error}`));
                })
                    .catch((error) => console.error(`Fatal error during FBX model preloader phase: ${error}`));
            });
        });
    })
        .catch((error) => console.error(`Fatal error during texture preloader phase: ${error}`));
});
