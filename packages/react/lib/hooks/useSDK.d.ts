import { Picnic } from "../sdk/sdk";
import type { Settings } from "../types";
declare type SDKLoadingState = {
    loaded: false;
};
declare type SDKLoadedState = {
    loaded: true;
    sdk: Picnic;
};
declare type SDKState = SDKLoadingState | SDKLoadedState;
export declare function useSDK(settings: Settings): SDKState;
export {};
//# sourceMappingURL=useSDK.d.ts.map