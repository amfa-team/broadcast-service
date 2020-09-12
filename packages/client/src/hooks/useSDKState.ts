import { useState, useEffect } from "react";
import { SDKState } from "../types";
import { Picnic, initialState } from "../sdk/sdk";

export function useSDKState(sdk: Picnic | null): SDKState {
  const [state, setSDKState] = useState<SDKState>(
    sdk?.getState() ?? initialState
  );

  useEffect(() => {
    const listener = () => {
      setSDKState(sdk?.getState() ?? initialState);
    };
    sdk?.addEventListener("state:change", listener);
    listener();
    return (): void => {
      sdk?.removeEventListener("state:change", listener);
      sdk?.destroy();
    };
  }, [sdk]);

  return state;
}
