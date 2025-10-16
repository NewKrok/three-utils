import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
interface FBXModelEntry {
    id: string;
    fbxModel: THREE.Group;
    material?: MaterialConfig | MaterialConfig[];
}
interface MaterialConfig {
    materialType?: new (params: any) => THREE.Material;
    texture?: {
        id: string;
        flipY?: boolean;
    };
    color?: number;
    alphaTest?: number;
}
interface LoadAssetsParams {
    textures: Array<{
        id: string;
        url: string;
    }>;
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
    fbxSkeletonAnimations: Array<{
        id: string;
        url: string;
    }>;
    audio: Array<{
        id: string;
        url: string;
    }>;
    onProgress?: (progress: number) => void;
    verbose?: boolean;
}
export declare const registerFBXModel: ({ id, fbxModel }: {
    id: string;
    fbxModel: THREE.Group;
}) => void;
export declare const getFBXModel: (id: string) => THREE.Group;
export declare const registerFBXSkeletonAnimation: ({ id, fbxModel }: {
    id: string;
    fbxModel: THREE.Group;
}) => void;
export declare const getFBXSkeletonAnimation: (id: string) => THREE.AnimationClip;
export declare const registerGLTFModel: ({ id, gltfModel }: {
    id: string;
    gltfModel: GLTF;
}) => void;
export declare const getGLTFModel: (id: string) => GLTF;
export declare const registerTexture: ({ id, texture }: {
    id: string;
    texture: THREE.Texture;
}) => void;
export declare const getTexture: (id: string) => THREE.Texture | null;
export declare const registerAudioBuffer: ({ id, audioBuffer }: {
    id: string;
    audioBuffer: AudioBuffer;
}) => void;
export declare const getAudioBuffer: (id: string) => AudioBuffer | null;
export declare const disposeAssets: () => void;
export declare const loadAssets: ({ textures, gltfModels, fbxModels, fbxSkeletonAnimations, audio, onProgress, verbose, }: LoadAssetsParams) => Promise<{
    fbxModels: FBXModelEntry[];
}>;
export {};
//# sourceMappingURL=assets.d.ts.map