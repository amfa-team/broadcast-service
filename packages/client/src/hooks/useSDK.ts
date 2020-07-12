import { useState, useEffect } from "react";
import { createDevice, loadDevice, generateUserId } from "../sdk/sfuClient";
import { types } from "mediasoup-client";

type SDKLoadingState = {
  loaded: false;
};

type SDKLoadedState = {
  loaded: true;
  device: types.Device;
  userId: string;
};

type SDKState = SDKLoadingState | SDKLoadedState;

export function useSDK(): SDKState {
  const [state, setSDKState] = useState<SDKState>({ loaded: false });

  useEffect(() => {
    const device = createDevice();
    const userId = generateUserId();
    loadDevice(userId, device).then(() =>
      setSDKState({
        loaded: true,
        device,
        userId,
      })
    );
    return (): void => {
      // TODO: handle disconnect
      console.error("should not be un-mounted");
    };
  }, []);

  return state;
}
