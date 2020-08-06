import type { types } from "mediasoup";
import {
  InitConnectionParams,
  ConnectionInfo,
  ConnectParams,
  DestroyConnectionParams,
  ReceiveInfo,
  ReceiveParams,
  SendParams,
} from "./mediasoup";

export type Route<P extends string, I, O> = {
  path: P;
  in: I;
  out: O;
};

export type RouterCapabilitiesRoute = Route<
  "/router-capabilities",
  null,
  types.RtpCapabilities
>;

export type InitConnectionRoute = Route<
  "/connect/init",
  InitConnectionParams,
  ConnectionInfo
>;

export type CreateConnectionRoute = Route<
  "/connect/create",
  ConnectParams,
  null
>;

export type DestroyConnectionRoute = Route<
  "/connect/destroy",
  DestroyConnectionParams,
  null
>;

export type CreateSendRoute = Route<"/send/create", SendParams, string>;

export type CreateReceiveRoute = Route<
  "/receive/create",
  ReceiveParams,
  ReceiveInfo
>;

export type PlayReceiveRoute = Route<"/receive/play", ReceiveParams, null>;
