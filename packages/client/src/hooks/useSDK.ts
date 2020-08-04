import { useState, useEffect } from "react";
import { createSDK } from "../sdk/sfuClient";
import { Settings, SDK } from "../types";

type SDKLoadingState = {
  loaded: false;
};

type SDKLoadedState = {
  loaded: true;
  sdk: SDK;
};

type SDKState = SDKLoadingState | SDKLoadedState;

export function useSDK(settings: Settings): SDKState {
  const [state, setSDKState] = useState<SDKState>({ loaded: false });

  useEffect(() => {
    createSDK(settings).then((sdk) => setSDKState({ loaded: true, sdk }));
    return (): void => {
      // TODO: handle disconnect
      console.error("should not be un-mounted");
    };
  }, []);

  return state;
}
