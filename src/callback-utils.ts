export const CallLimits = {
  NO_LIMIT: -1,
  CALL_1_PER_SECONDS: 1000,
  CALL_15_PER_SECONDS: 1000 / 15,
  CALL_30_PER_SECONDS: 1000 / 30,
  CALL_45_PER_SECONDS: 1000 / 45,
  CALL_60_PER_SECONDS: 1000 / 60,
  CALL_120_PER_SECONDS: 1000 / 120,
} as const;

interface CallData {
  lastUpdate: number;
  callCount: number;
}

interface CallWithReducerParams {
  id: string;
  callback: (param?: any) => void;
  callLimit: number;
  elapsed: number;
  callbackParam?: any;
  forceCallCount?: boolean;
}

let callData: Record<string, CallData> = {};

export const callWithReducer = ({
  id,
  callback,
  callLimit,
  elapsed,
  callbackParam,
  forceCallCount = false,
}: CallWithReducerParams): void => {
  if (!elapsed) return;
  if (!callData[id]) callData[id] = { lastUpdate: -1, callCount: 0 };

  const call = () => {
    if (callbackParam) callback(callbackParam);
    else callback();
  };

  if (callLimit === CallLimits.NO_LIMIT) {
    call();
    return;
  }

  if (forceCallCount) {
    const expectedCallCount = Math.floor(elapsed / (callLimit * 1000));
    while (
      callData[id].lastUpdate === -1 ||
      expectedCallCount > callData[id].callCount
    ) {
      call();
      callData[id].lastUpdate += callLimit;
      callData[id].callCount++;
    }
    callData[id].lastUpdate = elapsed;
  } else if (
    callData[id].lastUpdate === -1 ||
    elapsed - callData[id].lastUpdate >= callLimit
  ) {
    call();
    callData[id].lastUpdate = elapsed;
  }
};

export const clearCallReducerData = (id: string): boolean =>
  delete callData[id];

export const clearAllCallReducerData = (): void => {
  callData = {};
};
