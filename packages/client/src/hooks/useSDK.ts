import { useState, useEffect } from "react";
import { Settings } from "../types";
import { Picnic } from "../sdk/sdk";
import { captureException } from "@sentry/react";

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
  const { endpoint, token } = settings;

  useEffect(() => {
    const sdk = new Picnic({ endpoint, token });
    sdk
      .load()
      .then(() => setSDKState({ loaded: true, sdk }))
      // TODO: handle error
      .catch(captureException);
    return (): void => {
      sdk.destroy();
    };
  }, [endpoint, token]);

  return state;
}
