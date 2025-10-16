import * as THREE from 'three';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
import { getAudioBuffer } from '../assets/assets.js';
const defaultConfig = { loop: false, volume: 1, isMusic: false };
let audioConfig = {};
const audioCache = {};
const coreConfig = {
    masterVolume: 1,
    musicVolume: 1,
    effectsVolume: 1,
};
export const setAudioConfig = (config) => {
    audioConfig = config;
};
export const playAudio = ({ audioId, position, radius = 1, scene, camera, cacheId, }) => {
    const now = Date.now();
    let audio;
    if (!cacheId || !audioCache[cacheId]) {
        const audioBuffer = getAudioBuffer(audioId);
        if (!audioBuffer) {
            console.warn(`Audio buffer not found for ID: ${audioId}`);
            return;
        }
        const { loop, volume, isMusic } = {
            ...defaultConfig,
            ...audioConfig[audioId],
        };
        const listener = new THREE.AudioListener();
        let container;
        if (position && scene && camera) {
            audio = new THREE.PositionalAudio(listener);
            audio.setRefDistance(radius);
            const sphere = new THREE.SphereGeometry(radius, 32, 32);
            container = new THREE.Mesh(sphere);
            container.visible = false;
            const helper = new PositionalAudioHelper(audio, radius);
            audio.add(helper);
            container.position.copy(position);
            container.add(audio);
            scene.add(container);
            camera.add(listener);
        }
        else {
            audio = new THREE.Audio(listener);
        }
        audio.setBuffer(audioBuffer);
        audio.setLoop(loop || false);
        audio.setVolume((volume || 1) *
            coreConfig.masterVolume *
            (isMusic ? coreConfig.musicVolume : coreConfig.effectsVolume));
        audioCache[cacheId || audioId] = {
            audio,
            audioId,
            container,
            lastPlayedTime: now,
        };
    }
    else {
        const { audio: cachedAudio, container } = audioCache[cacheId];
        audio = cachedAudio;
        if (audio.isPlaying)
            audio.stop();
        if (container && position)
            container.position.copy(position);
        audioCache[cacheId].lastPlayedTime = now;
    }
    audio.play();
};
export const stopAudio = (cacheId) => {
    const audioEntry = getAudioCache(cacheId);
    if (audioEntry.audio && audioEntry.audio.isPlaying) {
        audioEntry.audio.stop();
    }
};
export const getAudioCache = (cacheId) => {
    return audioCache[cacheId] || {
        audio: null,
        audioId: '',
        container: undefined,
        lastPlayedTime: 0,
    };
};
const updateMusicVolumes = () => {
    Object.keys(audioCache).forEach((key) => {
        const { audio, audioId } = getAudioCache(key);
        if (audio) {
            const { volume, isMusic } = { ...defaultConfig, ...audioConfig[audioId] };
            audio.setVolume((volume || 1) *
                coreConfig.masterVolume *
                (isMusic ? coreConfig.musicVolume : coreConfig.effectsVolume));
        }
    });
};
export const setMasterVolume = (masterVolume) => {
    coreConfig.masterVolume = masterVolume;
    updateMusicVolumes();
};
export const setMusicVolume = (musicVolume) => {
    coreConfig.musicVolume = musicVolume;
    updateMusicVolumes();
};
export const setEffectsVolume = (effectsVolume) => {
    coreConfig.effectsVolume = effectsVolume;
    updateMusicVolumes();
};
const AudioPlayer = {
    playAudio,
    stopAudio,
    setMasterVolume,
    setMusicVolume,
    setEffectsVolume,
};
export default AudioPlayer;
