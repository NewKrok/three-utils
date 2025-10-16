import {
  callWithReducer,
  clearCallReducerData,
  clearAllCallReducerData,
  CallLimits,
} from '../callback-utils.js';

describe('CallbackUtils', () => {
  beforeEach(() => {
    clearAllCallReducerData();
    jest.clearAllMocks();
  });

  describe('CallLimits', () => {
    it('should have correct constant values', () => {
      expect(CallLimits.NO_LIMIT).toBe(-1);
      expect(CallLimits.CALL_1_PER_SECONDS).toBe(1000);
      expect(CallLimits.CALL_15_PER_SECONDS).toBe(1000 / 15);
      expect(CallLimits.CALL_30_PER_SECONDS).toBe(1000 / 30);
      expect(CallLimits.CALL_45_PER_SECONDS).toBe(1000 / 45);
      expect(CallLimits.CALL_60_PER_SECONDS).toBe(1000 / 60);
      expect(CallLimits.CALL_120_PER_SECONDS).toBe(1000 / 120);
    });
  });

  describe('callWithReducer', () => {
    const mockCallback = jest.fn();

    beforeEach(() => {
      mockCallback.mockClear();
    });

    it('should not call callback when elapsed is 0 or falsy', () => {
      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit: CallLimits.CALL_30_PER_SECONDS,
        elapsed: 0,
      });

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should call callback immediately with NO_LIMIT', () => {
      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit: CallLimits.NO_LIMIT,
        elapsed: 100,
      });

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should call callback with parameter when provided', () => {
      const param = { test: 'data' };

      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit: CallLimits.NO_LIMIT,
        elapsed: 100,
        callbackParam: param,
      });

      expect(mockCallback).toHaveBeenCalledWith(param);
    });

    it('should respect call limit timing', () => {
      const callLimit = 100; // 100ms limit

      // First call should work (elapsed > 0 is required)
      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit,
        elapsed: 50,
      });
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Second call within limit should not trigger
      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit,
        elapsed: 100,
      });
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Third call after limit should trigger
      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit,
        elapsed: 200,
      });
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('should handle forceCallCount correctly', () => {
      const callLimit = 0.1; // 0.1s limit (100ms in seconds)

      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit,
        elapsed: 250,
        forceCallCount: true,
      });

      // Should call multiple times based on elapsed time (250ms / 100ms = 2+ calls)
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple different IDs independently', () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      const callLimit = 100;

      callWithReducer({
        id: 'test1',
        callback: mockCallback1,
        callLimit,
        elapsed: 50,
      });

      callWithReducer({
        id: 'test2',
        callback: mockCallback2,
        callLimit,
        elapsed: 50,
      });

      expect(mockCallback1).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearCallReducerData', () => {
    it('should clear data for specific ID', () => {
      const mockCallback = jest.fn();

      // Set up some call data
      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit: 100,
        elapsed: 50,
      });

      const result = clearCallReducerData('test');
      expect(result).toBe(true);

      // Next call should behave as if it's the first call
      callWithReducer({
        id: 'test',
        callback: mockCallback,
        callLimit: 100,
        elapsed: 100,
      });
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('should return true when deleting non-existent ID (JavaScript delete behavior)', () => {
      const result = clearCallReducerData('non-existent');
      expect(result).toBe(true);
    });
  });

  describe('clearAllCallReducerData', () => {
    it('should clear all call data', () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();

      // Set up call data for multiple IDs
      callWithReducer({
        id: 'test1',
        callback: mockCallback1,
        callLimit: 100,
        elapsed: 50,
      });

      callWithReducer({
        id: 'test2',
        callback: mockCallback2,
        callLimit: 100,
        elapsed: 50,
      });

      clearAllCallReducerData();

      // Both should behave as first calls
      callWithReducer({
        id: 'test1',
        callback: mockCallback1,
        callLimit: 100,
        elapsed: 100,
      });

      callWithReducer({
        id: 'test2',
        callback: mockCallback2,
        callLimit: 100,
        elapsed: 100,
      });

      expect(mockCallback1).toHaveBeenCalledTimes(2);
      expect(mockCallback2).toHaveBeenCalledTimes(2);
    });
  });
});
