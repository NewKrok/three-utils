// Assets registry for textures and audio buffers
const textureRegistry = new Map<string, any>();
const audioBufferRegistry = new Map<string, AudioBuffer>();

export const registerTexture = (id: string, texture: any): void => {
  textureRegistry.set(id, texture);
};

export const getTexture = (id: string): any => {
  return textureRegistry.get(id) || null;
};

export const registerAudioBuffer = (
  id: string,
  audioBuffer: AudioBuffer
): void => {
  audioBufferRegistry.set(id, audioBuffer);
};

export const getAudioBuffer = (id: string): AudioBuffer | null => {
  return audioBufferRegistry.get(id) || null;
};
