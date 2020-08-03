import { useState, useEffect } from "react";
import { createTransport } from "../sdk/sfuClient";
import { types } from "mediasoup-client";
import { Settings } from "../types";

export function useTransport(
  settings: Settings,
  device: types.Device,
  type: "send" | "recv"
): types.Transport | null {
  const [transport, setTransport] = useState<types.Transport | null>(null);

  useEffect(() => {
    createTransport(settings, device, type).then(setTransport);

    return (): void => {
      // TODO: Should never happen
      // TODO: What about transport is still creating
      if (transport !== null) {
        transport.close();
      }
    };
  }, []);

  return transport;
}
