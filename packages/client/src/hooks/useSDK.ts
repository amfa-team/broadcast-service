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
  const { endpoint, token } = settings;
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const sdk = new Picnic({ endpoint, token });
    sdk
      .load()
      .then(() => setSDKState({ loaded: true, sdk }))
      // TODO: handle error
      .catch(setError);
    return (): void => {
      sdk.destroy();
    };
  }, [endpoint, token]);

  if (error !== null) {
    throw error;
  }

  return state;
}
