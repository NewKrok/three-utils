// Assets registry for textures and audio buffers
const textureRegistry = new Map();
const audioBufferRegistry = new Map();
export const registerTexture = (id, texture) => {
    textureRegistry.set(id, texture);
};
export const getTexture = (id) => {
    return textureRegistry.get(id) || null;
};
export const registerAudioBuffer = (id, audioBuffer) => {
    audioBufferRegistry.set(id, audioBuffer);
};
export const getAudioBuffer = (id) => {
    return audioBufferRegistry.get(id) || null;
};
