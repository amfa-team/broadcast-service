import type { types } from "mediasoup";
import type {
  ConnectParams,
  ConnectionInfo,
  ConsumerInfo,
  ConsumerState,
  DestroyConnectionParams,
  InitConnectionParams,
  ProducerState,
  ReceiveParams,
  SendDestroyParams,
  SendParams,
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

  "/send/state": Route<{ producerId: string }, ProducerState>;

  "/send/play": Route<{ producerId: string }, null>;

  "/send/pause": Route<{ producerId: string }, null>;

  "/send/destroy": Route<SendDestroyParams, null>;

  "/receive/create": Route<ReceiveParams, ConsumerInfo>;

  "/receive/state": Route<{ consumerId: string }, ConsumerState>;

  "/receive/play": Route<{ consumerId: string }, null>;

  "/receive/pause": Route<{ consumerId: string }, null>;
};
