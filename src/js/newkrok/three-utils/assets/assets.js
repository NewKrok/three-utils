import * as THREE from 'three';

import {
  loadAudio,
  loadFBXModels,
  loadGLTFModels,
  loadTextures,
} from './loaders.js';

import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { deepDispose } from '../dispose-utils.js';

const _fbxModels = {};
export const registerFBXModel = ({ id, fbxModel }) =>
  (_fbxModels[id] = fbxModel);
export const getFBXModel = (id) => {
  const clonedModel = clone(_fbxModels[id]);
  clonedModel.animations = [..._fbxModels[id].animations];
  return clonedModel;
};

const fbxSkeletonAnimations = {};
export const registerFBXSkeletonAnimation = ({ id, fbxModel }) =>
  (fbxSkeletonAnimations[id] = fbxModel.animations[0]);
export const getFBXSkeletonAnimation = (id) => fbxSkeletonAnimations[id];

const _gltfModels = {};
export const registerGLTFModel = ({ id, gltfModel }) =>
  (_gltfModels[id] = gltfModel);
export const getGLTFModel = (id) => _gltfModels[id];

const _textures = {};
export const registerTexture = ({ id, texture }) => (_textures[id] = texture);
export const getTexture = (id) => _textures[id];

const _audioBuffers = {};
export const registerAudioBuffer = ({ id, audioBuffer }) =>
  (_audioBuffers[id] = audioBuffer);
export const getAudioBuffer = (id) => _audioBuffers[id];

const applyMaterialConfig = ({
  material = null,
  materialConfig = { texture: { id: null }, color: 0xffffff, alphaTest: 0.5 },
}) => {
  material.map = materialConfig?.texture?.id
    ? getTexture(materialConfig?.texture.id)
    : null;
  material.alphaTest = materialConfig?.alphaTest || 0.5;
  material.color = new THREE.Color(materialConfig?.color || 0xffffff);
};

const createMaterial = (
  materialConfig = {
    materialType: null,
    texture: { id: null, flipY: true },
    color: 0xffffff,
    alphaTest: 0.5,
  }
) => {
  let material = null;
  if (materialConfig instanceof Array)
    material = materialConfig.map((config) => createMaterial(config));
  else if (materialConfig.materialType) {
    const map = materialConfig?.texture?.id
      ? getTexture(materialConfig?.texture.id)
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

export const loadAssets = ({
  textures,
  gltfModels,
  fbxModels,
  fbxSkeletonAnimations,
  audio,
  onProgress,
  verbose = true,
}) =>
  new Promise((resolve) => {
    const result = [];
    const assetCount =
      textures.length +
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
          element.encoding = THREE.sRGBEncoding;
          registerTexture(element);
        });
        if (verbose)
          console.log(`Textures(${loadedTextures.length}) are loaded...`);

        loadGLTFModels(gltfModels, updateProgress).then((loadedModels) => {
          loadedModels.forEach((element) => {
            const createdMaterial = createMaterial(element.material);
            let textureIndex = 0;
            element.gltfModel.scene.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material instanceof Array)
                  child.material = createdMaterial;
                else
                  child.material =
                    createdMaterial instanceof Array
                      ? createdMaterial[textureIndex]
                      : createdMaterial || child.material;
                if (!createdMaterial && element.material) {
                  applyMaterialConfig({
                    material: child.material,
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
          if (verbose)
            console.log(`GLTF Models(${loadedModels.length}) are loaded...`);

          loadFBXModels(fbxSkeletonAnimations, updateProgress).then(
            (loadedAnimations) => {
              loadedAnimations.forEach((element) => {
                registerFBXSkeletonAnimation(element);
              });
              if (verbose)
                console.log(
                  `FBX Skeleton Animations(${loadedAnimations.length}) are loaded...`
                );

              loadFBXModels(fbxModels, updateProgress)
                .then((loadedModels) => {
                  loadedModels.forEach((element) => {
                    const createdMaterial = createMaterial(element.material);
                    let textureIndex = 0;
                    element.fbxModel.traverse((child) => {
                      if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material instanceof Array)
                          child.material = createdMaterial;
                        else
                          child.material =
                            createdMaterial instanceof Array
                              ? createdMaterial[textureIndex]
                              : createdMaterial || child.material;
                        if (!createdMaterial && element.material) {
                          applyMaterialConfig({
                            material: child.material,
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
                  if (verbose)
                    console.log(
                      `FBX Models(${loadedModels.length}) are loaded...`
                    );

                  loadAudio(audio, updateProgress)
                    .then((loadedAudio) => {
                      loadedAudio.forEach((element) =>
                        registerAudioBuffer(element)
                      );
                      if (verbose)
                        console.log(
                          `Audio files(${loadedAudio.length}) are loaded...`
                        );
                      resolve(result);
                    })
                    .catch((error) =>
                      console.error(
                        `Fatal error during Audio files preloader phase: ${error}`
                      )
                    );
                })
                .catch((error) =>
                  console.error(
                    `Fatal error during FBX model preloader phase: ${error}`
                  )
                );
            }
          );
        });
      })
      .catch((error) =>
        console.error(`Fatal error during texture preloader phase: ${error}`)
      );
  });
