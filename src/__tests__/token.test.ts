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
  });
});
