import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

const fbxLoaders = Array.from({ length: 3 }, () => ({
  loader: new FBXLoader(),
  isUsed: false,
}));
let fbxLoaderQueue = [];

const textureLoaders = Array.from({ length: 3 }, () => ({
  loader: new THREE.TextureLoader(),
  isUsed: false,
}));
let textureLoaderQueue = [];

const audioLoaders = Array.from({ length: 3 }, () => ({
  loader: new THREE.AudioLoader(),
  isUsed: false,
}));
let audioLoaderQueue = [];

const getFBXLoader = (onComplete) =>
  getLoader(onComplete, fbxLoaders, fbxLoaderQueue);
const getTextureLoader = (onComplete) =>
  getLoader(onComplete, textureLoaders, textureLoaderQueue);
const getAudioLoader = (onComplete) =>
  getLoader(onComplete, audioLoaders, audioLoaderQueue);

const getLoader = (onComplete, loaders, loaderQueue) => {
  const loader = loaders.find((entry) => !entry.isUsed);
  if (loader) {
    loader.isUsed = true;
    onComplete(loader.loader);
  } else
    loaderQueue.push((availableLoader) => {
      onComplete(availableLoader.loader);
      availableLoader.isUsed = true;
    });
};

const releaseFBXLoader = (loader) =>
  releaseLoader(loader, fbxLoaders, fbxLoaderQueue);
const releaseTextureLoader = (loader) =>
  releaseLoader(loader, textureLoaders, textureLoaderQueue);
const releaseAudioLoader = (loader) =>
  releaseLoader(loader, audioLoaders, audioLoaderQueue);

const releaseLoader = (loader, loaders, loaderQueue) => {
  const loaderObject = loaders.find((entry) => entry.loader === loader);

  if (loaderQueue.length > 0) {
    loaderQueue[0](loaderObject);
    loaderQueue.shift();
  } else {
    loaderObject.isUsed = false;
  }
};

const loadGLTFModelRoutine = ({
  list,
  onElementLoaded,
  onComplete,
  onError,
}) => {
  if (list.length > 0) {
    const { url } = list[0];
    gltfLoader.load(url, ({ scene, animations }) => {
      onElementLoaded({
        ...list[0],
        gltfModel: { scene, animations },
      });
      list.shift();
      loadGLTFModelRoutine({ list, onElementLoaded, onComplete, onError });
    });
  } else onComplete();
};

export const loadGLTFModels = (list, onProgress) => {
  const elements = [];
  const onElementLoaded = (element) => {
    elements.push(element);
    onProgress();
  };

  const promise = new Promise((resolve, reject) => {
    loadGLTFModelRoutine({
      list,
      onElementLoaded,
      onComplete: () => resolve(elements),
      onError: (error) => reject(Error(`Something wrong happened: ${error}`)),
    });
  });

  return promise;
};

export const loadFBXModels = (list, onProgress) => {
  const elements = [];
  const onElementLoaded = (element) => {
    elements.push(element);
    onProgress();
  };

  const promise = new Promise((resolve, reject) => {
    if (list.length > 0) {
      while (list.length > 0) {
        const { url, id } = list[0];
        const current = list[0];
        list.shift();
        getFBXLoader((fbxLoader) =>
          fbxLoader.load(
            url,
            (fbxModel) => {
              onElementLoaded({ ...current, id, fbxModel });
              releaseFBXLoader(fbxLoader);

              if (!fbxLoaders.some((entry) => entry.isUsed)) resolve(elements);
            },
            null,
            (error) =>
              reject(
                Error(
                  `Something wrong happened with an FBX model: ${id}, url: ${url}, error: ${error}`
                )
              )
          )
        );
      }
    } else resolve([]);
  });
  return promise;
};

export const loadTextures = (list, onProgress) => {
  const elements = [];
  const onElementLoaded = (element) => {
    elements.push(element);
    onProgress();
  };

  const promise = new Promise((resolve, reject) => {
    if (list.length > 0) {
      while (list.length > 0) {
        const { url, id } = list[0];
        list.shift();
        getTextureLoader((textureLoader) =>
          textureLoader.load(
            url,
            (texture) => {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;

              onElementLoaded({ id, texture });
              releaseTextureLoader(textureLoader);

              if (!textureLoaders.some((entry) => entry.isUsed))
                resolve(elements);
            },
            null,
            (error) =>
              reject(
                Error(
                  `Something wrong happened with a texture: ${id}, url: ${url}, error: ${error}`
                )
              )
          )
        );
      }
    } else resolve([]);
  });

  return promise;
};

export const loadAudio = (list, onProgress) => {
  const elements = [];
  const onElementLoaded = (element) => {
    elements.push(element);
    onProgress();
  };

  const promise = new Promise((resolve, reject) => {
    if (list.length > 0) {
      while (list.length > 0) {
        const { url, id } = list[0];
        list.shift();
        getAudioLoader((audioLoader) =>
          audioLoader.load(
            url,
            (audioBuffer) => {
              onElementLoaded({ id, audioBuffer });
              releaseAudioLoader(audioLoader);

              if (!audioLoaders.some((entry) => entry.isUsed))
                resolve(elements);
            },
            null,
            (error) =>
              reject(
                Error(
                  `Something wrong happened with an audio: ${id}, url: ${url}, error: ${error}`
                )
              )
          )
        );
      }
    } else resolve([]);
  });

  return promise;
};
