export const patchObject = (
  objectA,
  objectB,
  config = { skippedProperties: [], applyToFirstObject: false }
) => {
  const result = {};
  Object.keys(objectA).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (
        typeof objectA[key] === 'object' &&
        objectA[key] &&
        objectB[key] &&
        !Array.isArray(objectA[key])
      ) {
        result[key] = patchObject(objectA[key], objectB[key], config);
      } else {
        result[key] =
          objectB[key] === 0
            ? 0
            : objectB[key] === false
              ? false
              : objectB[key] || objectA[key];
        if (config.applyToFirstObject) objectA[key] = result[key];
      }
    }
  });
  return result;
};

export const deepMerge = (
  objectA,
  objectB,
  config = { skippedProperties: [], applyToFirstObject: false }
) => {
  const result = {};
  Array.from(
    new Set([...Object.keys(objectA || {}), ...Object.keys(objectB || {})])
  ).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (
        typeof objectA[key] === 'object' &&
        objectA[key] &&
        objectB[key] &&
        !Array.isArray(objectA[key])
      ) {
        result[key] = deepMerge(objectA[key], objectB[key], config);
      } else {
        result[key] =
          objectB[key] === 0
            ? 0
            : objectB[key] === false
              ? false
              : objectB[key] || objectA[key];
        if (config.applyToFirstObject) objectA[key] = result[key];
      }
    }
  });
  return result;
};

const getObjectDiff = (
  objectA,
  objectB,
  config = { skippedProperties: [] }
) => {
  const result = {};
  Object.keys(objectA).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (
        typeof objectA[key] === 'object' &&
        objectA[key] &&
        objectB[key] &&
        !Array.isArray(objectA[key])
      ) {
        const objectDiff = getObjectDiff(objectA[key], objectB[key], config);
        if (Object.keys(objectDiff).length > 0) result[key] = objectDiff;
      } else {
        const mergedValue =
          objectB[key] === 0 ? 0 : objectB[key] || objectA[key];
        if (mergedValue !== objectA[key]) result[key] = mergedValue;
      }
    }
  });
  return result;
};
