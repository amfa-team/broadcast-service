import { types } from "mediasoup-client";
import { PicnicTransport } from "../transport/transport";
import { PicnicEvent } from "../events/event";
import { PicnicWebSocket } from "../websocket/websocket";

// https://github.com/microsoft/TypeScript/issues/33232#issuecomment-633343054
declare global {
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }

  // if constraints config still lose some prop, you can define it by yourself also
  interface MediaTrackConstraintSet {
    displaySurface?: ConstrainDOMString;
    logicalSurface?: ConstrainBoolean;
    // more....
  }
}

const videoConstraints = {
  audio: true,
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { max: 30 },
  },
};

const screenConstraints = {
  audio: true,
  video: {
    cursor: "motion",
    logicalSurface: true,
    displaySurface: "monitor",
    width: { max: 1920 },
    height: { max: 1080 },
    frameRate: { max: 30 },
  },
};

async function createVideoProducer(
  mediaStream: MediaStream,
  transport: PicnicTransport
): Promise<types.Producer | null> {
  const track = mediaStream.getVideoTracks()[0] ?? null;

  if (track === null) {
    // TODO: Handle this case, as it will cause the RecvStream to never being ready
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
      // { dtx: true, maxBitrate: 500000 },
      // { dtx: true, maxBitrate: 1000000 },
      // { dtx: true, maxBitrate: 2000000 },
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
    // TODO: Handle this case, as it will cause the RecvStream to never being ready
    return null;
  }

  return transport.produce({
    track,
    disableTrackOnPause: true,
    zeroRtpOnPause: true,
  });
}

async function resumeProducer(
  ws: PicnicWebSocket,
  transport: PicnicTransport,
  producer: types.Producer
): Promise<void> {
  await ws.send("/sfu/send/state", {
    state: "play",
    transportId: transport.getId(),
    producerId: producer.id,
  });
  producer.resume();
}

async function pauseProducer(
  ws: PicnicWebSocket,
  transport: PicnicTransport,
  producer: types.Producer
): Promise<void> {
  await ws.send("/sfu/send/state", {
    state: "pause",
    transportId: transport.getId(),
    producerId: producer.id,
  });
  producer.pause();
}

export default class SendStream extends EventTarget {
  #transport: PicnicTransport;
  #ws: PicnicWebSocket;

  #userMedia: MediaStream | null = null;
  #isScreenSharing = false;

  #videoProducer: types.Producer | null = null;
  #audioProducer: types.Producer | null = null;

  constructor(transport: PicnicTransport, ws: PicnicWebSocket) {
    super();
    this.#transport = transport;
    this.#ws = ws;
  }

  #destroyAudioProducer = async (): Promise<void> => {
    if (this.#audioProducer !== null) {
      await this.#ws
        .send("/sfu/send/state", {
          producerId: this.#audioProducer.id,
          transportId: this.#transport.getId(),
          state: "close",
        })
        .catch(() => null);
      this.#audioProducer.close();
    }
  };

  #destroyVideoProducer = async (): Promise<void> => {
    if (this.#videoProducer !== null) {
      await this.#ws
        .send("/sfu/send/state", {
          producerId: this.#videoProducer.id,
          transportId: this.#transport.getId(),
          state: "close",
        })
        .catch(() => null);
      this.#videoProducer?.close();
    }
  };

  async destroy(): Promise<void> {
    await Promise.all([
      this.#destroyAudioProducer(),
      this.#destroyVideoProducer(),
    ]);
  }

  async load(): Promise<void> {
    this.#userMedia = await navigator.mediaDevices.getUserMedia(
      videoConstraints
    );
    [this.#videoProducer, this.#audioProducer] = await Promise.all([
      createVideoProducer(this.#userMedia, this.#transport),
      createAudioProducer(this.#userMedia, this.#transport),
    ]);
  }

  async screenShare(): Promise<void> {
    this.#userMedia = await navigator.mediaDevices.getDisplayMedia(
      screenConstraints
    );
    const videoTrack = this.#userMedia.getVideoTracks()[0] ?? null;
    const audioTrack = this.#userMedia.getAudioTracks()[0] ?? null;

    if (videoTrack !== null) {
      this.#videoProducer?.replaceTrack({ track: videoTrack });
      videoTrack.addEventListener("ended", () => {
        this.disableShare();
      });
    }
    if (audioTrack !== null) {
      this.#audioProducer?.replaceTrack({ track: audioTrack });
    }

    this.#isScreenSharing = true;
    this.dispatchEvent(new PicnicEvent("media:change", null));
  }

  async disableShare(): Promise<void> {
    this.#userMedia = await navigator.mediaDevices.getUserMedia(
      videoConstraints
    );

    const videoTrack = this.#userMedia?.getVideoTracks()[0] ?? null;
    const audioTrack = this.#userMedia?.getAudioTracks()[0] ?? null;

    if (videoTrack !== null) {
      this.#videoProducer?.replaceTrack({ track: videoTrack });
    }
    if (audioTrack !== null) {
      this.#audioProducer?.replaceTrack({ track: audioTrack });
    }

    this.#isScreenSharing = false;
    this.dispatchEvent(new PicnicEvent("media:change", null));
  }

  isScreenShareEnabled(): boolean {
    return this.#isScreenSharing;
  }

  async pauseAudio(): Promise<void> {
    if (this.#audioProducer !== null) {
      await pauseProducer(this.#ws, this.#transport, this.#audioProducer);
    }
    this.dispatchEvent(new PicnicEvent("stream:pause", { kind: "audio" }));
  }

  async resumeAudio(): Promise<void> {
    if (this.#audioProducer !== null) {
      await resumeProducer(this.#ws, this.#transport, this.#audioProducer);
    }
    this.dispatchEvent(new PicnicEvent("stream:resume", { kind: "audio" }));
  }

  isAudioPaused(): boolean {
    return this.#audioProducer?.paused ?? true;
  }

  async pauseVideo(): Promise<void> {
    if (this.#videoProducer !== null) {
      await pauseProducer(this.#ws, this.#transport, this.#videoProducer);
    }
    this.dispatchEvent(new PicnicEvent("stream:pause", { kind: "video" }));
  }

  async resumeVideo(): Promise<void> {
    if (this.#videoProducer !== null) {
      await resumeProducer(this.#ws, this.#transport, this.#videoProducer);
    }
    this.dispatchEvent(new PicnicEvent("stream:resume", { kind: "video" }));
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
