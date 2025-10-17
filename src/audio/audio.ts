import * as THREE from 'three';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
import { getAudioBuffer } from '../assets/assets.js';

export type AudioConfig = {
  loop?: boolean;
  volume?: number;
  isMusic?: boolean;
};

export type PlayAudioParams = {
  audioId: string;
  position?: THREE.Vector3;
  radius?: number;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  cacheId?: string;
};

export type AudioCacheEntry = {
  audio: THREE.Audio<GainNode> | THREE.PositionalAudio;
  audioId: string;
  container?: THREE.Mesh;
  lastPlayedTime: number;
};

type CoreConfig = {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
};

const defaultConfig: AudioConfig = { loop: false, volume: 1, isMusic: false };
let audioConfig: Record<string, AudioConfig> = {};

const audioCache: Record<string, AudioCacheEntry> = {};
const coreConfig: CoreConfig = {
  masterVolume: 1,
  musicVolume: 1,
  effectsVolume: 1,
};

export const setAudioConfig = (config: Record<string, AudioConfig>): void => {
  audioConfig = config;
};

export const playAudio = ({
  audioId,
  position,
  radius = 1,
  scene,
  camera,
  cacheId,
}: PlayAudioParams): void => {
  const now = Date.now();
  let audio: THREE.Audio<GainNode> | THREE.PositionalAudio;

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
    let container: THREE.Mesh | undefined;

    if (position && scene && camera) {
      audio = new THREE.PositionalAudio(listener);
      (audio as THREE.PositionalAudio).setRefDistance(radius);
      const sphere = new THREE.SphereGeometry(radius, 32, 32);
      container = new THREE.Mesh(sphere);
      container.visible = false;
      const helper = new PositionalAudioHelper(
        audio as THREE.PositionalAudio,
        radius
      );
      audio.add(helper);
      container.position.copy(position);
      container.add(audio);
      scene.add(container);
      camera.add(listener);
    } else {
      audio = new THREE.Audio<GainNode>(listener);
    }

    audio.setBuffer(audioBuffer);
    audio.setLoop(loop || false);
    audio.setVolume(
      (volume || 1) *
        coreConfig.masterVolume *
        (isMusic ? coreConfig.musicVolume : coreConfig.effectsVolume)
    );

    audioCache[cacheId || audioId] = {
      audio,
      audioId,
      container,
      lastPlayedTime: now,
    };
  } else {
    const { audio: cachedAudio, container } = audioCache[cacheId];
    audio = cachedAudio;
    if (audio.isPlaying) audio.stop();
    if (container && position) container.position.copy(position);
    audioCache[cacheId].lastPlayedTime = now;
  }

  audio.play();
};

export const stopAudio = (cacheId: string): void => {
  const audioEntry = getAudioCache(cacheId);
  if (audioEntry.audio && audioEntry.audio.isPlaying) {
    audioEntry.audio.stop();
  }
};

export const getAudioCache = (cacheId: string): AudioCacheEntry => {
  return (
    audioCache[cacheId] || {
      audio: null as any,
      audioId: '',
      container: undefined,
      lastPlayedTime: 0,
    }
  );
};

const updateMusicVolumes = (): void => {
  Object.keys(audioCache).forEach((key) => {
    const { audio, audioId } = getAudioCache(key);
    if (audio) {
      const { volume, isMusic } = { ...defaultConfig, ...audioConfig[audioId] };
      audio.setVolume(
        (volume || 1) *
          coreConfig.masterVolume *
          (isMusic ? coreConfig.musicVolume : coreConfig.effectsVolume)
      );
    }
  });
};

export const setMasterVolume = (masterVolume: number): void => {
  coreConfig.masterVolume = masterVolume;
  updateMusicVolumes();
};

export const setMusicVolume = (musicVolume: number): void => {
  coreConfig.musicVolume = musicVolume;
  updateMusicVolumes();
};

export const setEffectsVolume = (effectsVolume: number): void => {
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
