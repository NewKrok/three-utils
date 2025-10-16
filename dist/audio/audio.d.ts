import * as THREE from 'three';
interface AudioConfig {
    loop?: boolean;
    volume?: number;
    isMusic?: boolean;
}
interface PlayAudioParams {
    audioId: string;
    position?: THREE.Vector3;
    radius?: number;
    scene?: THREE.Scene;
    camera?: THREE.Camera;
    cacheId?: string;
}
interface AudioCacheEntry {
    audio: THREE.Audio<GainNode> | THREE.PositionalAudio;
    audioId: string;
    container?: THREE.Mesh;
    lastPlayedTime: number;
}
export declare const setAudioConfig: (config: Record<string, AudioConfig>) => void;
export declare const playAudio: ({ audioId, position, radius, scene, camera, cacheId, }: PlayAudioParams) => void;
export declare const stopAudio: (cacheId: string) => void;
export declare const getAudioCache: (cacheId: string) => AudioCacheEntry;
export declare const setMasterVolume: (masterVolume: number) => void;
export declare const setMusicVolume: (musicVolume: number) => void;
export declare const setEffectsVolume: (effectsVolume: number) => void;
declare const AudioPlayer: {
    playAudio: ({ audioId, position, radius, scene, camera, cacheId, }: PlayAudioParams) => void;
    stopAudio: (cacheId: string) => void;
    setMasterVolume: (masterVolume: number) => void;
    setMusicVolume: (musicVolume: number) => void;
    setEffectsVolume: (effectsVolume: number) => void;
};
export default AudioPlayer;
//# sourceMappingURL=audio.d.ts.map