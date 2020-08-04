import { types } from "mediasoup-client";

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
  token: string;
};

export interface SDK {
  token: string;
  ws: WebSocket;
  device: types.Device;
}
