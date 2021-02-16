import { captureException } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import type { types } from "mediasoup-client";
import PicnicError from "../../exceptions/PicnicError";
import { PicnicEvent } from "../events/event";
import type { PicnicTransport } from "../transport/transport";
import type { PicnicWebSocket } from "../websocket/websocket";

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
    width: { ideal: 960 },
    height: { ideal: 540 },
    frameRate: { max: 24 },
  },
};

const screenConstraints = {
  audio: true,
  video: {
    cursor: "motion",
    logicalSurface: true,
    displaySurface: "monitor",
    width: { max: 1280 },
    height: { max: 720 },
    frameRate: { max: 24 },
  },
};

const audioKind = "audio" as const;
const videoKind = "video" as const;

async function createVideoProducer(
  mediaStream: MediaStream,
  transport: PicnicTransport,
): Promise<types.Producer | null> {
  const tracks = mediaStream.getVideoTracks();

  if (tracks.length === 0) {
    // TODO: Handle this case, as it will cause the RecvStream to never being ready
    return null;
  }
  const track = tracks[0];

  const producer = await transport.produce({
    track,
    codecOptions: {
      videoGoogleStartBitrate: 1000,
      videoGoogleMaxBitrate: 6_000_000,
    },
    disableTrackOnPause: true,
    zeroRtpOnPause: true,
    encodings: [
      {
        rid: "r0",
        dtx: true,
        maxBitrate: 100_000,
        scaleResolutionDownBy: 4, // 180
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        dtx: true,
        maxBitrate: 300_000,
        scaleResolutionDownBy: 2, // 360
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        dtx: true,
        scaleResolutionDownBy: 1, // 540
        maxBitrate: 700_000,
        scalabilityMode: "S1T3",
      },
    ],
  });

  // await producer.setMaxSpatialLayer(1);
  console.log(producer);

  return producer;
}

async function createAudioProducer(
  mediaStream: MediaStream,
  transport: PicnicTransport,
): Promise<types.Producer | null> {
  const tracks = mediaStream.getAudioTracks();

  if (tracks.length === 0) {
    // TODO: Handle this case, as it will cause the RecvStream to never being ready
    return null;
  }
  const track = tracks[0];

  return transport.produce({
    track,
    disableTrackOnPause: true,
    zeroRtpOnPause: true,
  });
}

async function resumeProducer(
  ws: PicnicWebSocket,
  transport: PicnicTransport,
  producer: types.Producer,
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
  producer: types.Producer,
): Promise<void> {
  await ws.send("/sfu/send/state", {
    state: "pause",
    transportId: transport.getId(),
    producerId: producer.id,
  });
  producer.pause();
}

export type SendStreamEvents = {
  "stream:pause": PicnicEvent<"stream:pause", { kind: "audio" | "video" }>;
  "stream:resume": PicnicEvent<"stream:resume", { kind: "audio" | "video" }>;
  "media:change": PicnicEvent<"media:change", null>;
  start: PicnicEvent<"start", null>;
  stop: PicnicEvent<"stop", null>;
};

export default class SendStream extends EventTarget<
  SendStreamEvents,
  "strict"
> {
  #transport: PicnicTransport;

  #ws: PicnicWebSocket;

  #active = false;

  #userMedia: MediaStream | null = null;

  #isScreenSharing = false;

  #videoProducer: types.Producer | null = null;

  #audioProducer: types.Producer | null = null;

  constructor(transport: PicnicTransport, ws: PicnicWebSocket) {
    super();
    this.#transport = transport;
    this.#ws = ws;
  }

  getId(): string {
    return this.#transport.getId();
  }

  #destroyAudioProducer = async (): Promise<void> => {
    if (this.#audioProducer !== null) {
      await this.#ws
        .send("/sfu/send/state", {
          producerId: this.#audioProducer.id,
          transportId: this.#transport.getId(),
          state: "close",
        })
        .catch(captureException);
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
        .catch(captureException);
      this.#videoProducer.close();
    }
  };

  async destroy(): Promise<void> {
    this.#active = false;

    await Promise.all([
      this.#destroyAudioProducer(),
      this.#destroyVideoProducer(),
    ]);

    if (this.#userMedia) {
      this.#userMedia.getTracks().forEach((track) => {
        track.stop();
      });
      this.#userMedia = null;
    }

    this.dispatchEvent(new PicnicEvent("stop", null));
  }

  isActive(): boolean {
    return this.#active;
  }

  async load(): Promise<void> {
    this.#userMedia = await navigator.mediaDevices.getUserMedia(
      videoConstraints,
    );
    [this.#videoProducer, this.#audioProducer] = await Promise.all([
      createVideoProducer(this.#userMedia, this.#transport),
      createAudioProducer(this.#userMedia, this.#transport),
    ]);
    this.dispatchEvent(new PicnicEvent("start", null));
    this.#active = true;
  }

  async screenShare(): Promise<void> {
    this.#userMedia = await navigator.mediaDevices.getDisplayMedia(
      screenConstraints,
    );
    const videoTracks = this.#userMedia.getVideoTracks();
    const audioTracks = this.#userMedia.getAudioTracks();

    if (videoTracks.length > 0) {
      const videoTrack = videoTracks[0];
      await this.#videoProducer?.replaceTrack({ track: videoTrack });
      // await this.#videoProducer?.setMaxSpatialLayer(2);
      videoTrack.addEventListener("ended", () => {
        this.disableShare().catch((e) => {
          console.error(e);
        });
      });
    }
    if (audioTracks.length > 0) {
      await this.#audioProducer?.replaceTrack({ track: audioTracks[0] });
    }

    this.#isScreenSharing = true;
    this.dispatchEvent(new PicnicEvent("media:change", null));
  }

  async disableShare(): Promise<void> {
    this.#userMedia = await navigator.mediaDevices.getUserMedia(
      videoConstraints,
    );

    const videoTrack = this.#userMedia?.getVideoTracks()[0] ?? null;
    const audioTrack = this.#userMedia?.getAudioTracks()[0] ?? null;

    if (videoTrack !== null) {
      await this.#videoProducer?.replaceTrack({ track: videoTrack });
      // await this.#videoProducer?.setMaxSpatialLayer(1);
    }
    if (audioTrack !== null) {
      await this.#audioProducer?.replaceTrack({ track: audioTrack });
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
    const evt = new PicnicEvent("stream:pause", { kind: audioKind });
    this.dispatchEvent(evt);
  }

  async resumeAudio(): Promise<void> {
    if (this.#audioProducer !== null) {
      await resumeProducer(this.#ws, this.#transport, this.#audioProducer);
    }
    this.dispatchEvent(new PicnicEvent("stream:resume", { kind: audioKind }));
  }

  isAudioPaused(): boolean {
    return this.#audioProducer?.paused ?? true;
  }

  async pauseVideo(): Promise<void> {
    if (this.#videoProducer !== null) {
      await pauseProducer(this.#ws, this.#transport, this.#videoProducer);
    }
    this.dispatchEvent(new PicnicEvent("stream:pause", { kind: videoKind }));
  }

  async resumeVideo(): Promise<void> {
    if (this.#videoProducer !== null) {
      await resumeProducer(this.#ws, this.#transport, this.#videoProducer);
    }
    this.dispatchEvent(new PicnicEvent("stream:resume", { kind: videoKind }));
  }

  isVideoPaused(): boolean {
    return this.#videoProducer?.paused ?? true;
  }

  getUserMediaStream(): MediaStream {
    if (this.#userMedia === null) {
      throw new PicnicError(
        "SendStream.getUserMediaStream: is not loaded",
        null,
      );
    }

    return this.#userMedia;
  }
}
