import { types } from "mediasoup";

export type CohortConnectFollowerRequest = {
  type: "follower";
  sctpCapabilities: types.SctpCapabilities;
};

export type CohortConnectSpeakerRequest = {
  type: "speaker";
  sctpCapabilities: types.SctpCapabilities;
  username: string;
};

export type CohortConnectRequest =
  | CohortConnectSpeakerRequest
  | CohortConnectSpeakerRequest;

export type CohortConnectResponse = {
  transportId: string;
  iceParameters: types.IceParameters;
  iceCandidates: types.IceCandidates;
  dtlsParameters: types.DtlsParameters;
  sctpParameters: types.SctpParameters | undefined;
};
