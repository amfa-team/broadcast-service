import { useState, useEffect } from "react";
import { Settings } from "../types";
import { Picnic } from "../sdk/sdk";

type SDKLoadingState = {
  loaded: false;
};

type SDKLoadedState = {
  loaded: true;
  sdk: Picnic;
};

type SDKState = SDKLoadingState | SDKLoadedState;

export function useSDK(settings: Settings): SDKState {
  const [state, setSDKState] = useState<SDKState>({ loaded: false });

  useEffect(() => {
    const sdk = new Picnic(settings);
    sdk
      .load()
      .then(() => setSDKState({ loaded: true, sdk }))
      // TODO: handle error
      .catch(console.error);
    return (): void => {
      // TODO: handle disconnect
      console.error("should not be un-mounted");
    };
  }, []);

  return state;
}
