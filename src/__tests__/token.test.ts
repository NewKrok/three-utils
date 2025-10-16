import { getUniqueId } from '../token.js';

describe('TokenUtils', () => {
  describe('getUniqueId', () => {
    it('should return incremental unique IDs', () => {
      const id1 = getUniqueId();
      const id2 = getUniqueId();
      const id3 = getUniqueId();

      expect(typeof id1).toBe('number');
      expect(typeof id2).toBe('number');
      expect(typeof id3).toBe('number');

      expect(id2).toBe(id1 + 1);
      expect(id3).toBe(id2 + 1);
    });

    it('should return different IDs on each call', () => {
      const ids = new Set();

      for (let i = 0; i < 10; i++) {
        ids.add(getUniqueId());
      }

      expect(ids.size).toBe(10);
    });

    it('should generate IDs consistently across multiple test runs', () => {
      const firstBatch = [getUniqueId(), getUniqueId(), getUniqueId()];
      const secondBatch = [getUniqueId(), getUniqueId(), getUniqueId()];

      // Should always be incrementally increasing
      expect(secondBatch[0]).toBe(firstBatch[2] + 1);
      expect(secondBatch[1]).toBe(firstBatch[2] + 2);
      expect(secondBatch[2]).toBe(firstBatch[2] + 3);
    });

    it('should handle rapid successive calls', () => {
      const rapidIds = [];
      for (let i = 0; i < 100; i++) {
        rapidIds.push(getUniqueId());
      }

      // Check that all IDs are unique and sequential
      for (let i = 1; i < rapidIds.length; i++) {
        expect(rapidIds[i]).toBe(rapidIds[i - 1] + 1);
      }
    });

    it('should return positive integer values', () => {
      for (let i = 0; i < 5; i++) {
        const id = getUniqueId();
        expect(Number.isInteger(id)).toBe(true);
        expect(id).toBeGreaterThan(0);
      }
    });
  });
});
