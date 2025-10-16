import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
export declare const loadGLTFModels: (list: AssetLoadItem[], onProgress: () => void) => Promise<GLTFModelResult[]>;
export declare const loadFBXModels: (list: AssetLoadItem[], onProgress: () => void) => Promise<FBXModelResult[]>;
export declare const loadTextures: (list: AssetLoadItem[], onProgress: () => void) => Promise<TextureResult[]>;
export declare const loadAudio: (list: AssetLoadItem[], onProgress: () => void) => Promise<AudioResult[]>;
export {};
//# sourceMappingURL=loaders.d.ts.map