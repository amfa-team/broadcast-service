import { useState, useEffect } from "react";
import { createDevice, loadDevice } from "../sdk/sfuClient";
import { types } from "mediasoup-client";
import { Settings } from "../types";

type SDKLoadingState = {
  loaded: false;
};

type SDKLoadedState = {
  loaded: true;
  device: types.Device;
};

type SDKState = SDKLoadingState | SDKLoadedState;

export function useSDK(settings: Settings): SDKState {
  const [state, setSDKState] = useState<SDKState>({ loaded: false });

  useEffect(() => {
    const device = createDevice();
    loadDevice(settings, device).then(() =>
      setSDKState({
        loaded: true,
        device,
      })
    );
    return (): void => {
      // TODO: handle disconnect
      console.error("should not be un-mounted");
    };
  }, []);

  return state;
}
