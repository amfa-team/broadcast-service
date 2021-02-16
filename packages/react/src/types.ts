import type { types } from "mediasoup-client";

type RecvResource = {
  audio: null | types.Consumer;
  video: null | types.Consumer;
  screen: null | types.Consumer;
};

export type SFUState = {
  device: types.Device;
  send: {
    transport: types.Transport | null;
    audio: null | types.Producer;
    video: null | types.Producer;
    screen: null | types.Producer;
  };
  receive: {
    transport: types.Transport | null;
    resources: { [producerId: string]: RecvResource };
  };
};
export type Settings = {
  endpoint: string;
  spaceId: string;
};

export type WebSocketState =
  | "initial"
  | "connecting"
  | "connected"
  | "closed"
  | "disconnected";

export type DeviceState = "initial" | "loading" | "ready" | "error";

export type TransportState =
  | "initial"
  | "creating"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type SDKState = {
  websocket: WebSocketState;
  device: DeviceState;
  recvTransport: TransportState;
  sendTransport: TransportState;
};
