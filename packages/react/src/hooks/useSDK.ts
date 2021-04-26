import { useToken } from "@amfa-team/user-service";
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
  const { endpoint, spaceId } = settings;
  const [error, setError] = useState<Error | null>(null);
  const token = useToken();

  useEffect(() => {
    if (token) {
      const abortController = new AbortController();
      const sdk = new Picnic(token, { endpoint, spaceId });
      if (!sdk.deviceSupported()) {
        if (!abortController.signal.aborted) {
          setError(new Error("DEVICE_NOT_SUPPORTED"));
        }
      } else {
        sdk
          .load()
          .then(() => {
            if (!abortController.signal.aborted) {
              setSDKState({ loaded: true, sdk });
            }
          })
          // TODO: handle error
          .catch((e) => {
            if (!abortController.signal.aborted) {
              setError(e);
            }
          });
      }

      return (): void => {
        abortController.abort();
        sdk.destroy().catch(console.error);
      };
    }

    return () => {
      // no-op
    };
  }, [endpoint, token, spaceId]);

  if (error !== null) {
    throw error;
  }

  return state;
}
