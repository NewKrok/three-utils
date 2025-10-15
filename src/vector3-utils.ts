import * as THREE from 'three';

export const absVector3 = (vector: THREE.Vector3): THREE.Vector3 => {
    vector.x = Math.abs(vector.x);
    vector.y = Math.abs(vector.y);
    vector.z = Math.abs(vector.z);

    return vector;
};