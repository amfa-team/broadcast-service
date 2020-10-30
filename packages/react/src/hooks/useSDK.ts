import { useEffect, useState } from "react";
import { Picnic } from "../sdk/sdk";
import type { Settings } from "../types";

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
      sdk.destroy().catch(console.error);
    };
  }, [endpoint, token]);

  if (error !== null) {
    throw error;
  }

  return state;
}
