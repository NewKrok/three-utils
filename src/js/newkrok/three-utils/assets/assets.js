import * as THREE from "three";

import {
  loadAudio,
  loadFBXModels,
  loadGLTFModels,
  loadTextures,
} from "./loaders.js";

import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

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
    texture: { id: null },
    color: 0xffffff,
    alphaTest: 0.5,
  }
) => {
  let material = null;
  if (materialConfig instanceof Array)
    material = materialConfig.map((config) => getMaterial(config));
  else if (materialConfig.materialType) {
    material = new materialConfig.materialType({
      map: materialConfig?.texture?.id
        ? getTexture(materialConfig?.texture.id)
        : null,
      alphaTest: materialConfig.alphaTest || 0.5,
      color: new THREE.Color(materialConfig?.color || 0xffffff),
    });
  }
  return material;
};

export const loadAssets = ({
  textures,
  gltfModels,
  fbxModels,
  fbxSkeletonAnimations,
  audio,
  onProgress,
}) =>
  new Promise((resolve) => {
    const result = [];
    const assetCount =
      textures.length + gltfModels.length + fbxModels.length + audio.length;
    let loadedCount = 0;
    const updateProgress = () =>
      onProgress && onProgress(++loadedCount / assetCount);

    loadTextures(textures, updateProgress)
      .then((loadedTextures) => {
        loadedTextures.forEach((element) => {
          element.encoding = THREE.sRGBEncoding;
          registerTexture(element);
        });
        console.log(`Textures(${loadedTextures.length}) are loaded...`);

        loadGLTFModels(gltfModels, updateProgress).then((loadedModels) => {
          loadedModels.forEach((element) => {
            element.gltfModel.scene.traverse((child) => {
              let material = null;
              if (element.materialType) {
                if (element.texture instanceof Array)
                  material = element.texture.map(
                    (id) =>
                      new element.materialType({
                        map: getTexture(id),
                        alphaTest: 0.5,
                        color: element.color || 0xffffff,
                      })
                  );
                else if (element.materialType) {
                  const textureId =
                    typeof element.texture.id === "function"
                      ? element.texture.id(child)
                      : element.texture.id;
                  material = new element.materialType({
                    map: getTexture(textureId),
                    alphaTest: 0.5,
                    color: element.color || 0xffffff,
                  });
                }
              }
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (element.texture?.repeat && material.map) {
                  if (typeof element.texture.repeat === "function") {
                    const calculatedRepeat = element.texture.repeat(child);
                    material = material.clone();
                    material.map = material.map.clone();
                    material.map.needsUpdate = true;
                    material.map.repeat.set(
                      calculatedRepeat.x,
                      calculatedRepeat.y
                    );
                  } else
                    material.map.repeat.set(
                      element.texture.repeat.x,
                      element.texture.repeat.y
                    );
                }
                // TODO: handle texture id array
                child.material = material || child.material;
              }
            });
            registerGLTFModel(element);
          });
          console.log(`GLTF Models(${loadedModels.length}) are loaded...`);

          loadFBXModels(fbxSkeletonAnimations, updateProgress).then(
            (loadedAnimations) => {
              loadedAnimations.forEach((element) => {
                registerFBXSkeletonAnimation(element);
              });
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
                  console.log(
                    `FBX Models(${loadedModels.length}) are loaded...`
                  );

                  loadAudio(audio, updateProgress)
                    .then((loadedAudio) => {
                      loadedAudio.forEach((element) =>
                        registerAudioBuffer(element)
                      );
                      console.log(
                        `Audio files(${loadedAudio.length}) are loaded...`
                      );
                      resolve(result);
                    })
                    .catch((error) =>
                      console.log(
                        `Fatal error during Audio files preloader phase: ${error}`
                      )
                    );
                })
                .catch((error) =>
                  console.log(
                    `Fatal error during FBX model preloader phase: ${error}`
                  )
                );
            }
          );
        });
      })
      .catch((error) =>
        console.log(`Fatal error during texture preloader phase: ${error}`)
      );
  });
