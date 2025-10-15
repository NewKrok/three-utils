export type ObjectOperationConfig = {
    skippedProperties?: Array<string>;
    applyToFirstObject?: boolean;
};
export declare const patchObject: <T, V>(objectA: T, objectB: V, config?: ObjectOperationConfig) => T;
export declare const deepMerge: <T, V>(objectA: T, objectB: V, config?: ObjectOperationConfig) => T | V;
export declare const getObjectDiff: <T, V>(objectA: T, objectB: V, config?: ObjectOperationConfig) => Partial<T | V>;
//# sourceMappingURL=object-utils.d.ts.map