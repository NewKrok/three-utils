import { formatTime, TimePattern } from '../time-utils.js';

describe('TimeUtils', () => {
  describe('formatTime', () => {
    it('should format time correctly using HH_MM_SS pattern', () => {
      const time = 3661000; // 1 hour, 1 minute, 1 second
      const result = formatTime(time, TimePattern.HH_MM_SS);
      expect(result).toBe('01:01:01');
    });

    it('should format time correctly using MM_SS pattern', () => {
      const time = 125000; // 2 minutes, 5 seconds
      const result = formatTime(time, TimePattern.MM_SS);
      expect(result).toBe('02:05');
    });

    it('should format time correctly using MM_SS_MS pattern', () => {
      const time = 125250; // 2 minutes, 5 seconds, 250 milliseconds
      const result = formatTime(time, TimePattern.MM_SS_MS);
      expect(result).toBe('02:05.250');
    });

    it('should handle zero time', () => {
      const result = formatTime(0, TimePattern.HH_MM_SS);
      expect(result).toBe('00:00:00');
    });

    it('should handle large values', () => {
      const time = 3599999; // 59 minutes, 59 seconds, 999 milliseconds
      const result = formatTime(time, TimePattern.HH_MM_SS);
      expect(result).toBe('00:59:59');
    });
  });
});
