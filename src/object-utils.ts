export type ObjectOperationConfig = {
  skippedProperties?: Array<string>;
  applyToFirstObject?: boolean;
};

export const patchObject = <T, V>(
  objectA: T,
  objectB: V,
  config: ObjectOperationConfig = {
    skippedProperties: [],
    applyToFirstObject: false,
  }
): T => {
  const result = {} as any;
  Object.keys(objectA as any).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (
        typeof (objectA as any)[key] === 'object' &&
        (objectA as any)[key] &&
        (objectB as any)[key] &&
        !Array.isArray((objectA as any)[key])
      ) {
        result[key] = patchObject(
          (objectA as any)[key],
          (objectB as any)[key],
          config
        );
      } else {
        result[key] =
          (objectB as any)[key] === 0
            ? 0
            : (objectB as any)[key] === false
              ? false
              : (objectB as any)[key] || (objectA as any)[key];
        if (config.applyToFirstObject) (objectA as any)[key] = result[key];
      }
    }
  });
  return result;
};

export const deepMerge = <T, V>(
  objectA: T,
  objectB: V,
  config: ObjectOperationConfig = {
    skippedProperties: [],
    applyToFirstObject: false,
  }
): T | V => {
  const result = {} as any;
  Array.from(
    new Set([
      ...Object.keys((objectA || {}) as any),
      ...Object.keys((objectB || {}) as any),
    ])
  ).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (
        typeof (objectA as any)?.[key] === 'object' &&
        (objectA as any)?.[key] &&
        (objectB as any)?.[key] &&
        !Array.isArray((objectA as any)[key])
      ) {
        result[key] = deepMerge(
          (objectA as any)[key],
          (objectB as any)[key],
          config
        );
      } else {
        result[key] =
          (objectB as any)?.[key] === 0
            ? 0
            : (objectB as any)?.[key] === false
              ? false
              : (objectB as any)?.[key] || (objectA as any)?.[key];
        if (config.applyToFirstObject) (objectA as any)[key] = result[key];
      }
    }
  });
  return result;
};

export const getObjectDiff = <T, V>(
  objectA: T,
  objectB: V,
  config: ObjectOperationConfig = { skippedProperties: [] }
): Partial<T | V> => {
  const result = {} as any;
  Object.keys(objectA as any).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (
        typeof (objectA as any)[key] === 'object' &&
        (objectA as any)[key] &&
        (objectB as any)[key] &&
        !Array.isArray((objectA as any)[key])
      ) {
        const objectDiff = getObjectDiff(
          (objectA as any)[key],
          (objectB as any)[key],
          config
        );
        if (Object.keys(objectDiff).length > 0) result[key] = objectDiff;
      } else {
        const mergedValue =
          (objectB as any)[key] === 0
            ? 0
            : (objectB as any)[key] || (objectA as any)[key];
        if (mergedValue !== (objectA as any)[key]) result[key] = mergedValue;
      }
    }
  });
  return result;
};
