import {
  patchObject,
  deepMerge,
  getObjectDiff,
  ObjectOperationConfig,
} from '../object-utils.js';

describe('ObjectUtils', () => {
  describe('patchObject', () => {
    it('should patch simple object properties', () => {
      const objectA = { a: 1, b: 2, c: 3 };
      const objectB = { b: 5, c: 6 };

      const result = patchObject(objectA, objectB);

      expect(result).toEqual({ a: 1, b: 5, c: 6 });
    });

    it('should handle zero and false values correctly', () => {
      const objectA = { a: 1, b: true, c: 'test' };
      const objectB = { a: 0, b: false, c: null };

      const result = patchObject(objectA, objectB);

      expect(result).toEqual({ a: 0, b: false, c: 'test' });
    });

    it('should handle nested objects', () => {
      const objectA = {
        level1: {
          a: 1,
          b: 2,
          level2: {
            x: 10,
            y: 20,
          },
        },
      };
      const objectB = {
        level1: {
          b: 5,
          level2: {
            y: 25,
            z: 30,
          },
        },
      };

      const result = patchObject(objectA, objectB);

      expect(result.level1.a).toBe(1);
      expect(result.level1.b).toBe(5);
      expect(result.level1.level2.x).toBe(10);
      expect(result.level1.level2.y).toBe(25);
    });

    it('should skip properties when specified in config', () => {
      const objectA = { a: 1, b: 2, c: 3 };
      const objectB = { a: 10, b: 20, c: 30 };
      const config: ObjectOperationConfig = {
        skippedProperties: ['b'],
      };

      const result = patchObject(objectA, objectB, config);

      expect(result).toEqual({ a: 10, c: 30 });
    });

    it('should apply to first object when specified in config', () => {
      const objectA = { a: 1, b: 2, c: 3 };
      const objectB = { b: 5, c: 6 };
      const config: ObjectOperationConfig = {
        applyToFirstObject: true,
      };

      const result = patchObject(objectA, objectB, config);

      expect(result).toEqual({ a: 1, b: 5, c: 6 });
      expect(objectA).toEqual({ a: 1, b: 5, c: 6 }); // Should modify original
    });

    it('should handle arrays correctly (not merge them)', () => {
      const objectA = { arr: [1, 2, 3], other: 'test' };
      const objectB = { arr: [4, 5], other: 'updated' };

      const result = patchObject(objectA, objectB);

      expect(result.arr).toEqual([4, 5]);
      expect(result.other).toBe('updated');
    });
  });

  describe('deepMerge', () => {
    it('should merge simple objects', () => {
      const objectA = { a: 1, b: 2 };
      const objectB = { c: 3, d: 4 };

      const result = deepMerge(objectA, objectB);

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('should handle overlapping properties', () => {
      const objectA = { a: 1, b: 2, c: 3 };
      const objectB = { b: 20, c: 30, d: 40 };

      const result = deepMerge(objectA, objectB);

      expect(result).toEqual({ a: 1, b: 20, c: 30, d: 40 });
    });

    it('should handle zero and false values correctly', () => {
      const objectA = { a: 1, b: true, c: 'test' };
      const objectB = { a: 0, b: false, c: 'test' };

      const result = deepMerge(objectA, objectB) as any;

      expect(result.a).toBe(0);
      expect(result.b).toBe(false);
      expect(result.c).toBe('test');
    });

    it('should handle nested objects', () => {
      const objectA = {
        level1: {
          a: 1,
          level2: { x: 10 },
        },
      };
      const objectB = {
        level1: {
          b: 2,
          level2: { y: 20 },
        },
      };

      const result = deepMerge(objectA, objectB) as any;

      expect(result.level1.a).toBe(1);
      expect(result.level1.b).toBe(2);
      expect(result.level1.level2.x).toBe(10);
      expect(result.level1.level2.y).toBe(20);
    });

    it('should handle null/undefined objects', () => {
      const objectA = { a: 1, b: 2 };
      const objectB = null;

      const result = deepMerge(objectA, objectB);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should skip properties when specified in config', () => {
      const objectA = { a: 1, b: 2 };
      const objectB = { b: 20, c: 3 };
      const config: ObjectOperationConfig = {
        skippedProperties: ['b'],
      };

      const result = deepMerge(objectA, objectB, config);

      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should apply to first object when specified in config', () => {
      const objectA = { a: 1, b: 2 };
      const objectB = { c: 3, d: 4 };
      const config: ObjectOperationConfig = {
        applyToFirstObject: true,
      };

      const result = deepMerge(objectA, objectB, config);

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
      expect(objectA).toEqual({ a: 1, b: 2, c: 3, d: 4 }); // Should modify original
    });
  });

  describe('getObjectDiff', () => {
    it('should return empty object when objects are identical', () => {
      const objectA = { a: 1, b: 2, c: 3 };
      const objectB = { a: 1, b: 2, c: 3 };

      const result = getObjectDiff(objectA, objectB);

      expect(result).toEqual({});
    });

    it('should return differences between objects', () => {
      const objectA = { a: 1, b: 2, c: 3 };
      const objectB = { a: 1, b: 20, c: 3 };

      const result = getObjectDiff(objectA, objectB);

      expect(result).toEqual({ b: 20 });
    });

    it('should handle zero values correctly', () => {
      const objectA = { a: 1, b: 'original', c: 'test' };
      const objectB = { a: 0, b: 'changed', c: 'test' };

      const result = getObjectDiff(objectA, objectB);

      expect(result).toEqual({ a: 0, b: 'changed' });
    });

    it('should handle false values (treated as falsy)', () => {
      const objectA = { a: true, b: 'value' };
      const objectB = { a: false, b: 'value' };

      const result = getObjectDiff(objectA, objectB);

      // false is falsy, so it falls back to objectA value, no diff
      expect(result).toEqual({});
    });

    it('should handle nested objects', () => {
      const objectA = {
        level1: {
          a: 1,
          b: 2,
          level2: {
            x: 10,
            y: 20,
          },
        },
      };
      const objectB = {
        level1: {
          a: 1,
          b: 5,
          level2: {
            x: 15,
            y: 20,
          },
        },
      };

      const result = getObjectDiff(objectA, objectB);

      expect(result).toEqual({
        level1: {
          b: 5,
          level2: {
            x: 15,
          },
        },
      });
    });

    it('should handle missing properties in objectB', () => {
      const objectA = { a: 1, b: 2, c: 3 };
      const objectB = { a: 1, c: 30 };

      const result = getObjectDiff(objectA, objectB);

      expect(result).toEqual({ c: 30 });
    });

    it('should skip properties when specified in config', () => {
      const objectA = { a: 1, b: 2, c: 3 };
      const objectB = { a: 10, b: 20, c: 30 };
      const config: ObjectOperationConfig = {
        skippedProperties: ['b'],
      };

      const result = getObjectDiff(objectA, objectB, config);

      expect(result).toEqual({ a: 10, c: 30 });
    });

    it('should handle arrays correctly', () => {
      const objectA = { arr: [1, 2, 3], other: 'same' };
      const objectB = { arr: [4, 5], other: 'same' };

      const result = getObjectDiff(objectA, objectB);

      expect(result).toEqual({ arr: [4, 5] });
    });
  });
});
