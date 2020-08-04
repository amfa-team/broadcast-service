import { useState, useEffect } from "react";
import { createTransport } from "../sdk/sfuClient";
import { types } from "mediasoup-client";
import { SDK } from "../types";

export function useTransport(
  sdk: SDK,
  type: "send" | "recv"
): types.Transport | null {
  const [transport, setTransport] = useState<types.Transport | null>(null);

  useEffect(() => {
    createTransport(sdk, type).then(setTransport);

    return (): void => {
      // TODO: Should never happen
      // TODO: What about transport is still creating
      if (transport !== null) {
        transport.close();
      }
    };
  }, [sdk, type]);

  return transport;
}
