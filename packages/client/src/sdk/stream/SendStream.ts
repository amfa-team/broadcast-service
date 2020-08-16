import { types } from "mediasoup-client";
import { PicnicTransport } from "../transport/transport";

const constraints = {
  audio: true,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

async function createVideoProducer(
  mediaStream: MediaStream,
  transport: PicnicTransport
): Promise<types.Producer | null> {
  const track = mediaStream.getVideoTracks()[0] ?? null;

  if (track === null) {
    return null;
  }

  return transport.produce({
    track,
    codecOptions: {
      videoGoogleStartBitrate: 1000,
      videoGoogleMaxBitrate: 2000000,
    },
    disableTrackOnPause: true,
    zeroRtpOnPause: true,
    encodings: [
      { scaleResolutionDownBy: 4, maxBitrate: 500000 },
      { scaleResolutionDownBy: 2, maxBitrate: 1000000 },
      { scaleResolutionDownBy: 1, maxBitrate: 2000000 },
    ],
  });
}

async function createAudioProducer(
  mediaStream: MediaStream,
  transport: PicnicTransport
): Promise<types.Producer | null> {
  const track = mediaStream.getAudioTracks()[0] ?? null;

  if (track === null) {
    return null;
  }

  return transport.produce({
    track,
    disableTrackOnPause: true,
    zeroRtpOnPause: true,
  });
}

export default class SendStream {
  #transport: PicnicTransport;

  #userMedia: MediaStream | null = null;

  #videoProducer: types.Producer | null = null;
  #audioProducer: types.Producer | null = null;

  constructor(transport: PicnicTransport) {
    this.#transport = transport;
  }

  async load(): Promise<void> {
    this.#userMedia = await navigator.mediaDevices.getUserMedia(constraints);
    [this.#videoProducer, this.#audioProducer] = await Promise.all([
      createVideoProducer(this.#userMedia, this.#transport),
      createAudioProducer(this.#userMedia, this.#transport),
    ]);
  }

  pauseAudio(): void {
    this.#audioProducer?.pause();
  }

  resumeAudio(): void {
    this.#audioProducer?.resume();
  }

  isAudioPaused(): boolean {
    return this.#audioProducer?.paused ?? true;
  }

  pauseVideo(): void {
    this.#videoProducer?.pause();
  }

  resumeVideo(): void {
    this.#videoProducer?.resume();
  }

  isVideoPaused(): boolean {
    return this.#videoProducer?.paused ?? true;
  }

  getUserMediaStream(): MediaStream {
    if (this.#userMedia === null) {
      throw new Error("SendStream.getUserMediaStream: is not loaded");
    }

    return this.#userMedia;
  }

  unload(): void {
    if (this.#userMedia) {
      this.#userMedia.getTracks().forEach((track) => track.stop());
      this.#userMedia = null;
    }
  }
}
