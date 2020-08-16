import type { types } from "mediasoup";

export type InitConnectionParams = {
  type: "send" | "recv";
  sctpCapabilities: types.SctpCapabilities;
};

export type ConnectionInfo = {
  transportId: string;
  iceParameters: types.IceParameters;
  iceCandidates: types.IceCandidate[];
  dtlsParameters: types.DtlsParameters;
  sctpParameters: types.SctpParameters | undefined;
};

export type ConnectParams = {
  transportId: string;
  dtlsParameters: types.DtlsParameters;
};

export interface DestroyConnectionParams {
  transportId: string;
}

export type SendParams = {
  transportId: string;
  kind: types.MediaKind;
  rtpParameters: types.RtpParameters;
};

export type SendDestroyParams = {
  transportId: string;
  producerId: string;
};

export type ReceiveParams = {
  transportId: string;
  sourceTransportId: string;
  producerId: string;
  rtpCapabilities: types.RtpCapabilities;
};

export type ConsumerInfo = {
  consumerId: string;
  producerId: string;
  kind: types.MediaKind;
  rtpParameters: types.RtpParameters;
};

export type ReceiveInfo = { [producerId: string]: ConsumerInfo[] };
