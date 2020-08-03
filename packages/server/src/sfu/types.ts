import { types } from "mediasoup";

export type InitConnectionParams = {
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

export type SendParams = {
  transportId: string;
  kind: types.MediaKind;
  rtpParameters: types.RtpParameters;
};

export type ReceiveParams = {
  transportId: string;
  rtpCapabilities: types.RtpCapabilities;
};

export type ConsumerInfo = {
  consumerId: string;
  producerId: string;
  kind: types.MediaKind;
  rtpParameters: types.RtpParameters;
};

export type ReceiveInfo = { [producerId: string]: ConsumerInfo[] };
