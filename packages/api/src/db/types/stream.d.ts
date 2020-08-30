export interface StreamKey {
  transportId: string;
  producerId: string;
}

export interface StreamInfo extends StreamKey {
  kind: "audio" | "video";
  score: number;
}

export interface PatchStream extends Partial<StreamInfo> {
  transportId: string; // required
  producerId: string; // required
}
