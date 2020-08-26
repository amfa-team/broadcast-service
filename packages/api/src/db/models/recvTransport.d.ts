export interface RecvTransportKey {
  transportId: string;
}

export interface RecvTransport extends RecvTransportKey {
  audioTrack: string | null;
  videoTrack: string | null;
}
