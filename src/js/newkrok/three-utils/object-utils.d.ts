export type ObjectOperationConfig = {
  skippedProperties: Array<String>;
  applyToFirstObject: boolean;
};

export function patchObject<T, V>(
  objectA: T,
  objectB: V,
  config: ObjectOperationConfig
): T;
export function deepMerge<T, V>(
  objectA: T,
  objectB: V,
  config: ObjectOperationConfig
): T | V;
