export declare const CallLimits: {
    readonly NO_LIMIT: -1;
    readonly CALL_1_PER_SECONDS: 1000;
    readonly CALL_15_PER_SECONDS: number;
    readonly CALL_30_PER_SECONDS: number;
    readonly CALL_45_PER_SECONDS: number;
    readonly CALL_60_PER_SECONDS: number;
    readonly CALL_120_PER_SECONDS: number;
};
interface CallWithReducerParams {
    id: string;
    callback: (param?: any) => void;
    callLimit: number;
    elapsed: number;
    callbackParam?: any;
    forceCallCount?: boolean;
}
export declare const callWithReducer: ({ id, callback, callLimit, elapsed, callbackParam, forceCallCount, }: CallWithReducerParams) => void;
export declare const clearCallReducerData: (id: string) => boolean;
export declare const clearAllCallReducerData: () => void;
export {};
//# sourceMappingURL=callback-utils.d.ts.map