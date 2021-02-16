export interface SendTransportKey {
  _id: string;
}

export interface SendTransport extends SendTransportKey {
  audioTrack: string | null;
  videoTrack: string | null;
}

export interface PatchSendTransport extends Partial<SendTransport> {
  transportId: string; // required
}
