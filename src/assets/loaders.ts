import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Type definitions
interface LoaderEntry<T> {
  loader: T;
  isUsed: boolean;
}

interface AssetLoadItem {
  id: string;
  url: string;
}

interface FBXModelResult extends AssetLoadItem {
  fbxModel: THREE.Group;
}

interface GLTFModelResult extends AssetLoadItem {
  gltfModel: GLTF;
}

interface TextureResult extends AssetLoadItem {
  texture: THREE.Texture;
}

interface AudioResult extends AssetLoadItem {
  audioBuffer: AudioBuffer;
}

type LoaderQueue<T> = Array<(loader: LoaderEntry<T>) => void>;

// Loader instances
const gltfLoader = new GLTFLoader();

const fbxLoaders: LoaderEntry<FBXLoader>[] = Array.from({ length: 3 }, () => ({
  loader: new FBXLoader(),
  isUsed: false,
}));
let fbxLoaderQueue: LoaderQueue<FBXLoader> = [];

const textureLoaders: LoaderEntry<THREE.TextureLoader>[] = Array.from(
  { length: 3 },
  () => ({
    loader: new THREE.TextureLoader(),
    isUsed: false,
  })
);
let textureLoaderQueue: LoaderQueue<THREE.TextureLoader> = [];

const audioLoaders: LoaderEntry<THREE.AudioLoader>[] = Array.from(
  { length: 3 },
  () => ({
    loader: new THREE.AudioLoader(),
    isUsed: false,
  })
);
let audioLoaderQueue: LoaderQueue<THREE.AudioLoader> = [];

// Loader getter functions
const getFBXLoader = (onComplete: (loader: FBXLoader) => void): void =>
  getLoader(onComplete, fbxLoaders, fbxLoaderQueue);

const getTextureLoader = (
  onComplete: (loader: THREE.TextureLoader) => void
): void => getLoader(onComplete, textureLoaders, textureLoaderQueue);

const getAudioLoader = (
  onComplete: (loader: THREE.AudioLoader) => void
): void => getLoader(onComplete, audioLoaders, audioLoaderQueue);

const getLoader = <T>(
  onComplete: (loader: T) => void,
  loaders: LoaderEntry<T>[],
  loaderQueue: LoaderQueue<T>
): void => {
  const loader = loaders.find((entry) => !entry.isUsed);
  if (loader) {
    loader.isUsed = true;
    onComplete(loader.loader);
  } else {
    loaderQueue.push((availableLoader) => {
      onComplete(availableLoader.loader);
      availableLoader.isUsed = true;
    });
  }
};

// Loader release functions
const releaseFBXLoader = (loader: FBXLoader): void =>
  releaseLoader(loader, fbxLoaders, fbxLoaderQueue);

const releaseTextureLoader = (loader: THREE.TextureLoader): void =>
  releaseLoader(loader, textureLoaders, textureLoaderQueue);

const releaseAudioLoader = (loader: THREE.AudioLoader): void =>
  releaseLoader(loader, audioLoaders, audioLoaderQueue);

const releaseLoader = <T>(
  loader: T,
  loaders: LoaderEntry<T>[],
  loaderQueue: LoaderQueue<T>
): void => {
  const loaderObject = loaders.find((entry) => entry.loader === loader);

  if (loaderObject) {
    if (loaderQueue.length > 0) {
      const callback = loaderQueue.shift();
      if (callback) {
        callback(loaderObject);
      }
    } else {
      loaderObject.isUsed = false;
    }
  }
};

// GLTF Model loading
const loadGLTFModelRoutine = ({
  list,
  onElementLoaded,
  onComplete,
  onError,
}: {
  list: AssetLoadItem[];
  onElementLoaded: (element: GLTFModelResult) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}): void => {
  if (list.length > 0) {
    const { url } = list[0];
    gltfLoader.load(
      url,
      ({ scene, animations }) => {
        onElementLoaded({
          ...list[0],
          gltfModel: { scene, animations } as GLTF,
        });
        list.shift();
        loadGLTFModelRoutine({ list, onElementLoaded, onComplete, onError });
      },
      undefined,
      (error) => onError(String(error))
    );
  } else {
    onComplete();
  }
};

export const loadGLTFModels = (
  list: AssetLoadItem[],
  onProgress: () => void
): Promise<GLTFModelResult[]> => {
  const elements: GLTFModelResult[] = [];
  const onElementLoaded = (element: GLTFModelResult): void => {
    elements.push(element);
    onProgress();
  };

  const promise = new Promise<GLTFModelResult[]>((resolve, reject) => {
    loadGLTFModelRoutine({
      list: [...list], // Create a copy to avoid modifying the original
      onElementLoaded,
      onComplete: () => resolve(elements),
      onError: (error) =>
        reject(new Error(`Something wrong happened: ${error}`)),
    });
  });

  return promise;
};

export const loadFBXModels = (
  list: AssetLoadItem[],
  onProgress: () => void
): Promise<FBXModelResult[]> => {
  const elements: FBXModelResult[] = [];
  const onElementLoaded = (element: FBXModelResult): void => {
    elements.push(element);
    onProgress();
  };

  const promise = new Promise<FBXModelResult[]>((resolve, reject) => {
    if (list.length > 0) {
      const listCopy = [...list]; // Create a copy to avoid modifying the original
      while (listCopy.length > 0) {
        const { url, id } = listCopy[0];
        const current = listCopy[0];
        listCopy.shift();
        getFBXLoader((fbxLoader) =>
          fbxLoader.load(
            url,
            (fbxModel) => {
              onElementLoaded({ ...current, id, fbxModel });
              releaseFBXLoader(fbxLoader);

              if (!fbxLoaders.some((entry) => entry.isUsed)) {
                resolve(elements);
              }
            },
            undefined,
            (error) =>
              reject(
                new Error(
                  `Something wrong happened with an FBX model: ${id}, url: ${url}, error: ${error}`
                )
              )
          )
        );
      }
    } else {
      resolve([]);
    }
  });
  return promise;
};

export const loadTextures = (
  list: AssetLoadItem[],
  onProgress: () => void
): Promise<TextureResult[]> => {
  const elements: TextureResult[] = [];
  const onElementLoaded = (element: TextureResult): void => {
    elements.push(element);
    onProgress();
  };

  const promise = new Promise<TextureResult[]>((resolve, reject) => {
    if (list.length > 0) {
      const listCopy = [...list]; // Create a copy to avoid modifying the original
      while (listCopy.length > 0) {
        const { url, id } = listCopy[0];
        listCopy.shift();
        getTextureLoader((textureLoader) =>
          textureLoader.load(
            url,
            (texture) => {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;

              onElementLoaded({ id, url, texture });
              releaseTextureLoader(textureLoader);

              if (!textureLoaders.some((entry) => entry.isUsed)) {
                resolve(elements);
              }
            },
            undefined,
            (error) =>
              reject(
                new Error(
                  `Something wrong happened with a texture: ${id}, url: ${url}, error: ${error}`
                )
              )
          )
        );
      }
    } else {
      resolve([]);
    }
  });

  return promise;
};

export const loadAudio = (
  list: AssetLoadItem[],
  onProgress: () => void
): Promise<AudioResult[]> => {
  const elements: AudioResult[] = [];
  const onElementLoaded = (element: AudioResult): void => {
    elements.push(element);
    onProgress();
  };

  const promise = new Promise<AudioResult[]>((resolve, reject) => {
    if (list.length > 0) {
      const listCopy = [...list]; // Create a copy to avoid modifying the original
      while (listCopy.length > 0) {
        const { url, id } = listCopy[0];
        listCopy.shift();
        getAudioLoader((audioLoader) =>
          audioLoader.load(
            url,
            (audioBuffer) => {
              onElementLoaded({ id, url, audioBuffer });
              releaseAudioLoader(audioLoader);

              if (!audioLoaders.some((entry) => entry.isUsed)) {
                resolve(elements);
              }
            },
            undefined,
            (error) =>
              reject(
                new Error(
                  `Something wrong happened with an audio: ${id}, url: ${url}, error: ${error}`
                )
              )
          )
        );
      }
    } else {
      resolve([]);
    }
  });

  return promise;
};
