export const absVector3 = (vector) => {
    vector.x = Math.abs(vector.x);
    vector.y = Math.abs(vector.y);
    vector.z = Math.abs(vector.z);
    return vector;
};
