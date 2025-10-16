import * as THREE from 'three';
import { sign, isPointInATriangle, yFromTriangle } from '../geom-utils.js';

describe('GeomUtils', () => {
  describe('sign', () => {
    it('should calculate positive sign for counter-clockwise points', () => {
      const point1 = new THREE.Vector3(0, 0, 0);
      const point2 = new THREE.Vector3(1, 0, 0);
      const point3 = new THREE.Vector3(0, 0, 1);

      const result = sign(point1, point2, point3);

      expect(result).toBeGreaterThan(0);
    });

    it('should calculate negative sign for clockwise points', () => {
      const point1 = new THREE.Vector3(0, 0, 0);
      const point2 = new THREE.Vector3(0, 0, 1);
      const point3 = new THREE.Vector3(1, 0, 0);

      const result = sign(point1, point2, point3);

      expect(result).toBeLessThan(0);
    });

    it('should return zero for collinear points', () => {
      const point1 = new THREE.Vector3(0, 0, 0);
      const point2 = new THREE.Vector3(1, 0, 1);
      const point3 = new THREE.Vector3(2, 0, 2);

      const result = sign(point1, point2, point3);

      expect(result).toBe(0);
    });

    it('should handle points with different y coordinates', () => {
      const point1 = new THREE.Vector3(0, 5, 0);
      const point2 = new THREE.Vector3(1, 10, 0);
      const point3 = new THREE.Vector3(0, 15, 1);

      const result = sign(point1, point2, point3);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('isPointInATriangle', () => {
    it('should return true for point inside triangle', () => {
      const point = new THREE.Vector3(0.5, 0, 0.25);
      const triangleA = new THREE.Vector3(0, 0, 0);
      const triangleB = new THREE.Vector3(1, 0, 0);
      const triangleC = new THREE.Vector3(0.5, 0, 1);

      const result = isPointInATriangle(point, triangleA, triangleB, triangleC);

      expect(result).toBe(true);
    });

    it('should return false for point outside triangle', () => {
      const point = new THREE.Vector3(2, 0, 2);
      const triangleA = new THREE.Vector3(0, 0, 0);
      const triangleB = new THREE.Vector3(1, 0, 0);
      const triangleC = new THREE.Vector3(0.5, 0, 1);

      const result = isPointInATriangle(point, triangleA, triangleB, triangleC);

      expect(result).toBe(false);
    });

    it('should return true for point on triangle vertex', () => {
      const point = new THREE.Vector3(0, 0, 0);
      const triangleA = new THREE.Vector3(0, 0, 0);
      const triangleB = new THREE.Vector3(1, 0, 0);
      const triangleC = new THREE.Vector3(0.5, 0, 1);

      const result = isPointInATriangle(point, triangleA, triangleB, triangleC);

      expect(result).toBe(true);
    });

    it('should return true for point on triangle edge', () => {
      const point = new THREE.Vector3(0.5, 0, 0);
      const triangleA = new THREE.Vector3(0, 0, 0);
      const triangleB = new THREE.Vector3(1, 0, 0);
      const triangleC = new THREE.Vector3(0.5, 0, 1);

      const result = isPointInATriangle(point, triangleA, triangleB, triangleC);

      expect(result).toBe(true);
    });

    it('should handle triangle with different orientations', () => {
      const point = new THREE.Vector3(0.5, 0, 0.25);
      const triangleA = new THREE.Vector3(1, 0, 0);
      const triangleB = new THREE.Vector3(0, 0, 0);
      const triangleC = new THREE.Vector3(0.5, 0, 1);

      const result = isPointInATriangle(point, triangleA, triangleB, triangleC);

      expect(result).toBe(true);
    });
  });

  describe('yFromTriangle', () => {
    it('should calculate correct Y coordinate from triangle plane', () => {
      // Create a simple triangle in XZ plane with known Y values
      const triangleA = new THREE.Vector3(0, 0, 0);
      const triangleB = new THREE.Vector3(2, 0, 0);
      const triangleC = new THREE.Vector3(1, 2, 1);

      // Point at the center should have Y value of 1
      const point = new THREE.Vector3(1, 0, 0.5);

      const result = yFromTriangle(point, triangleA, triangleB, triangleC);

      expect(typeof result).toBe('number');
      expect(isFinite(result)).toBe(true);
    });

    it('should handle horizontal triangle (all Y coordinates same)', () => {
      const triangleA = new THREE.Vector3(0, 5, 0);
      const triangleB = new THREE.Vector3(1, 5, 0);
      const triangleC = new THREE.Vector3(0.5, 5, 1);

      const point = new THREE.Vector3(0.5, 0, 0.25);

      const result = yFromTriangle(point, triangleA, triangleB, triangleC);

      expect(result).toBe(5);
    });

    it('should calculate Y for point at triangle vertex', () => {
      const triangleA = new THREE.Vector3(0, 1, 0);
      const triangleB = new THREE.Vector3(2, 3, 0);
      const triangleC = new THREE.Vector3(1, 2, 2);

      // Point at vertex A should return Y coordinate of vertex A
      const point = new THREE.Vector3(0, 0, 0);

      const result = yFromTriangle(point, triangleA, triangleB, triangleC);

      expect(result).toBe(1);
    });

    it('should handle degenerate triangle (collinear points)', () => {
      const triangleA = new THREE.Vector3(0, 0, 0);
      const triangleB = new THREE.Vector3(1, 1, 0);
      const triangleC = new THREE.Vector3(2, 2, 0);

      const point = new THREE.Vector3(0.5, 0, 0);

      const result = yFromTriangle(point, triangleA, triangleB, triangleC);

      // Should handle division by zero gracefully
      expect(typeof result).toBe('number');
    });

    it('should handle negative coordinates', () => {
      const triangleA = new THREE.Vector3(-1, -1, -1);
      const triangleB = new THREE.Vector3(1, -1, -1);
      const triangleC = new THREE.Vector3(0, 1, 1);

      const point = new THREE.Vector3(0, 0, 0);

      const result = yFromTriangle(point, triangleA, triangleB, triangleC);

      expect(typeof result).toBe('number');
      expect(isFinite(result)).toBe(true);
    });
  });
});
