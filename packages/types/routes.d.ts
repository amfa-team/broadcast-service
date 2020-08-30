import type { types } from "mediasoup";
import {
  InitConnectionParams,
  ConnectionInfo,
  ConnectParams,
  DestroyConnectionParams,
  ReceiveParams,
  SendParams,
  ConsumerInfo,
} from "./mediasoup";

export type Route<I, O> = {
  in: I;
  out: O;
};

export type Routes = {
  "/router-capabilities": Route<null, types.RtpCapabilities>;

  "/connect/init": Route<InitConnectionParams, ConnectionInfo>;

  "/connect/create": Route<ConnectParams, null>;

  "/connect/destroy": Route<DestroyConnectionParams, null>;

  "/send/create": Route<SendParams, string>;

  "/send/destroy": Route<SendDestroyParams, null>;

  "/receive/create": Route<ReceiveParams, ConsumerInfo>;

  "/receive/play": Route<{ consumerId: string }, null>;

  "/receive/pause": Route<{ consumerId: string }, null>;
};
