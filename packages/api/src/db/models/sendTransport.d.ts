export interface SendTransportKey {
  transportId: string;
}

export interface SendTransport extends SendTransportKey {
  audioTrack: string | null;
  videoTrack: string | null;
}

export interface PatchSendTransport extends Partial<SendTransport> {
  transportId: string; // required
}
