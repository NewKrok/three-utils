import * as THREE from 'three';
import { absVector3 } from '../vector3-utils.js';

describe('Vector3Utils', () => {
  describe('absVector3', () => {
    it('should convert all negative values to positive', () => {
      const vector = new THREE.Vector3(-5, -10, -15);

      const result = absVector3(vector);

      expect(result.x).toBe(5);
      expect(result.y).toBe(10);
      expect(result.z).toBe(15);
    });

    it('should keep positive values unchanged', () => {
      const vector = new THREE.Vector3(3, 7, 12);

      const result = absVector3(vector);

      expect(result.x).toBe(3);
      expect(result.y).toBe(7);
      expect(result.z).toBe(12);
    });

    it('should handle mixed positive and negative values', () => {
      const vector = new THREE.Vector3(-8, 4, -2);

      const result = absVector3(vector);

      expect(result.x).toBe(8);
      expect(result.y).toBe(4);
      expect(result.z).toBe(2);
    });

    it('should handle zero values', () => {
      const vector = new THREE.Vector3(0, -0, 0);

      const result = absVector3(vector);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    it('should modify the original vector (mutating function)', () => {
      const vector = new THREE.Vector3(-3, -6, -9);
      const originalVector = vector;

      const result = absVector3(vector);

      expect(result).toBe(originalVector); // Should return the same instance
      expect(vector.x).toBe(3);
      expect(vector.y).toBe(6);
      expect(vector.z).toBe(9);
    });

    it('should handle floating point values', () => {
      const vector = new THREE.Vector3(-1.5, 2.7, -3.14159);

      const result = absVector3(vector);

      expect(result.x).toBe(1.5);
      expect(result.y).toBe(2.7);
      expect(result.z).toBe(3.14159);
    });

    it('should handle very small negative values', () => {
      const vector = new THREE.Vector3(-0.001, -0.0001, -0.00001);

      const result = absVector3(vector);

      expect(result.x).toBe(0.001);
      expect(result.y).toBe(0.0001);
      expect(result.z).toBe(0.00001);
    });

    it('should handle very large values', () => {
      const vector = new THREE.Vector3(-1000000, 999999, -123456.789);

      const result = absVector3(vector);

      expect(result.x).toBe(1000000);
      expect(result.y).toBe(999999);
      expect(result.z).toBe(123456.789);
    });
  });
});
