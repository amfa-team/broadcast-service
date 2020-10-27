import { useEffect, useState } from "react";
import type { Picnic } from "../sdk/sdk";
import { initialState } from "../sdk/sdk";
import type { SDKState } from "../types";

export function useSDKState(sdk: Picnic | null): SDKState {
  const [state, setSDKState] = useState<SDKState>(
    sdk?.getState() ?? initialState,
  );

  useEffect(() => {
    const listener = () => {
      setSDKState(sdk?.getState() ?? initialState);
    };
    sdk?.addEventListener("state:change", listener);
    listener();
    return (): void => {
      sdk?.removeEventListener("state:change", listener);
      sdk?.destroy().catch(console.error);
    };
  }, [sdk]);

  return state;
}
