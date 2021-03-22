import { captureException } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import debounce from "lodash.debounce";
import type { types } from "mediasoup-client";
import PicnicError from "../../exceptions/PicnicError";
import { PicnicEvent } from "../events/event";
import type { PicnicTransport } from "../transport/transport";
import type { PicnicWebSocket } from "../websocket/websocket";

// https://github.com/microsoft/TypeScript/issues/33232_issuecomment-633343054
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
  destroy: PicnicEvent<"destroy", null>;
};

export interface ISendStream extends EventTarget<SendStreamEvents, "strict"> {
  getId(): string;
  attachVideoEffect(el: HTMLVideoElement | null): () => void;
  isAudioPaused(): boolean;
  isVideoPaused(): boolean;
  isScreenShareEnabled(): boolean;
  isReady(): boolean;
  destroy(): Promise<void>;
  isReconnecting(): boolean;
  toggleAudio(): Promise<void>;
  toggleVideo(): Promise<void>;
  toggleScreenShare(): Promise<void>;
}

export default class SendStream
  extends EventTarget<SendStreamEvents, "strict">
  implements ISendStream {
  _transport: PicnicTransport;

  _ws: PicnicWebSocket;

  _ready = false;

  _userMedia: MediaStream | null = null;

  _isScreenSharing = false;

  _videoProducer: types.Producer | null = null;

  _audioProducer: types.Producer | null = null;

  _el: HTMLVideoElement | null = null;

  constructor(transport: PicnicTransport, ws: PicnicWebSocket) {
    super();
    this._transport = transport;
    this._ws = ws;
  }

  getId(): string {
    return this._transport.getId();
  }

  _autoPlayVideo = () => {
    document.removeEventListener("click", this._autoPlayVideo);

    if (!this.isVideoPaused()) {
      this._el?.play().catch((e) => {
        if (e.name === "NotAllowedError") {
          document.addEventListener("click", this._autoPlayVideo, false);
        } else {
          captureException(e);
        }
      });
    } else {
      this._el?.pause();
    }
  };

  attachVideoEffect = (el: HTMLVideoElement | null) => {
    if (el === null) {
      return () => {
        // no-op
      };
    }

    this._el = el;
    this._el.srcObject = this._userMedia;
    this._el.onloadedmetadata = this._autoPlayVideo;
    this._el.muted = true;

    return () => {
      // eslint-disable-next-line no-param-reassign
      el.srcObject = null;
      this._el = null;

      document.removeEventListener("click", this._autoPlayVideo);
    };
  };

  _destroyAudioProducer = async (): Promise<void> => {
    if (this._audioProducer !== null) {
      await this._ws
        .send("/sfu/send/state", {
          producerId: this._audioProducer.id,
          transportId: this._transport.getId(),
          state: "close",
        })
        .catch(captureException);
      this._audioProducer.close();
    }
  };

  _destroyVideoProducer = async (): Promise<void> => {
    if (this._videoProducer !== null) {
      await this._ws
        .send("/sfu/send/state", {
          producerId: this._videoProducer.id,
          transportId: this._transport.getId(),
          state: "close",
        })
        .catch(captureException);
      this._videoProducer.close();
    }
  };

  async destroy(): Promise<void> {
    this._ready = false;

    await Promise.all([
      this._destroyAudioProducer(),
      this._destroyVideoProducer(),
    ]);

    if (this._userMedia) {
      this._userMedia.getTracks().forEach((track) => {
        track.stop();
      });
      this._userMedia = null;
    }

    this.dispatchEvent(new PicnicEvent("destroy", null));
  }

  isReady(): boolean {
    return this._ready;
  }

  isReconnecting(): boolean {
    // TODO !!
    return !this._ready;
  }

  async load(): Promise<void> {
    this._userMedia = await navigator.mediaDevices.getUserMedia(
      videoConstraints,
    );
    [this._videoProducer, this._audioProducer] = await Promise.all([
      createVideoProducer(this._userMedia, this._transport),
      createAudioProducer(this._userMedia, this._transport),
    ]);
    this._ready = true;
    if (this._el !== null) {
      this._el.srcObject = this._userMedia;
    }
    this.dispatchEvent(new PicnicEvent("start", null));
  }

  screenShare = debounce(
    async (): Promise<void> => {
      this._userMedia = await navigator.mediaDevices.getDisplayMedia(
        screenConstraints,
      );
      const videoTracks = this._userMedia.getVideoTracks();
      const audioTracks = this._userMedia.getAudioTracks();

      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0];
        await this._videoProducer?.replaceTrack({ track: videoTrack });
        // await this._videoProducer?.setMaxSpatialLayer(2);
        videoTrack.addEventListener("ended", () => {
          // TODO: 2 differents video tracks
          // @ts-ignore
          this.disableShare().catch((e) => {
            console.error(e);
          });
        });
      }
      if (audioTracks.length > 0) {
        await this._audioProducer?.replaceTrack({ track: audioTracks[0] });
      }

      this._isScreenSharing = true;
      this.dispatchEvent(new PicnicEvent("media:change", null));
      if (this._el !== null) {
        this._el.srcObject = this._userMedia;
      }
    },
    500,
    { leading: true },
  );

  disableShare = debounce(
    async (): Promise<void> => {
      this._userMedia = await navigator.mediaDevices.getUserMedia(
        videoConstraints,
      );

      const videoTrack = this._userMedia?.getVideoTracks()[0] ?? null;
      const audioTrack = this._userMedia?.getAudioTracks()[0] ?? null;

      if (videoTrack !== null) {
        await this._videoProducer?.replaceTrack({ track: videoTrack });
        // await this._videoProducer?.setMaxSpatialLayer(1);
      }
      if (audioTrack !== null) {
        await this._audioProducer?.replaceTrack({ track: audioTrack });
      }

      this._isScreenSharing = false;
      this.dispatchEvent(new PicnicEvent("media:change", null));
      if (this._el !== null) {
        this._el.srcObject = this._userMedia;
      }
    },
    500,
    { leading: true },
  );

  isScreenShareEnabled(): boolean {
    return this._isScreenSharing;
  }

  async toggleScreenShare(): Promise<void> {
    return this.isScreenShareEnabled()
      ? this.screenShare()
      : this.disableShare();
  }

  pauseAudio = debounce(
    async (): Promise<void> => {
      if (this._audioProducer !== null) {
        await pauseProducer(this._ws, this._transport, this._audioProducer);
      }
      const evt = new PicnicEvent("stream:pause", { kind: audioKind });
      this.dispatchEvent(evt);
    },
    500,
    { leading: true },
  );

  resumeAudio = debounce(
    async (): Promise<void> => {
      if (this._audioProducer !== null) {
        await resumeProducer(this._ws, this._transport, this._audioProducer);
      }
      this.dispatchEvent(new PicnicEvent("stream:resume", { kind: audioKind }));
    },
    500,
    { leading: true },
  );

  isAudioPaused(): boolean {
    return this._audioProducer?.paused ?? true;
  }

  async toggleAudio(): Promise<void> {
    return this.isAudioPaused() ? this.resumeAudio() : this.pauseAudio();
  }

  pauseVideo = debounce(
    async (): Promise<void> => {
      if (this._videoProducer !== null) {
        await pauseProducer(this._ws, this._transport, this._videoProducer);
      }
      this.dispatchEvent(new PicnicEvent("stream:pause", { kind: videoKind }));
    },
    500,
    { leading: true },
  );

  resumeVideo = debounce(
    async (): Promise<void> => {
      if (this._videoProducer !== null) {
        await resumeProducer(this._ws, this._transport, this._videoProducer);
      }
      this.dispatchEvent(new PicnicEvent("stream:resume", { kind: videoKind }));
    },
    500,
    { leading: true },
  );

  async toggleVideo(): Promise<void> {
    return this.isVideoPaused() ? this.resumeVideo() : this.pauseVideo();
  }

  isVideoPaused(): boolean {
    return this._videoProducer?.paused ?? true;
  }

  getUserMediaStream(): MediaStream {
    if (this._userMedia === null) {
      throw new PicnicError(
        "SendStream.getUserMediaStream: is not loaded",
        null,
      );
    }

    return this._userMedia;
  }
}
