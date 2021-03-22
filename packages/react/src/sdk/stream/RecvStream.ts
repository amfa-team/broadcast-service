import type {
  ConsumerInfo,
  ConsumerState,
  ReceiveParams,
} from "@amfa-team/broadcast-service-types";
import { captureException } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import debounce from "lodash.debounce";
import type { types } from "mediasoup-client";
import type { PicnicDevice } from "../device/device";
import type { ServerEvents } from "../events/event";
import { PicnicEvent } from "../events/event";
import type { PicnicTransport } from "../transport/transport";
import type { PicnicWebSocket } from "../websocket/websocket";

interface RecvStreamOptions {
  ws: PicnicWebSocket;
  transport: PicnicTransport;
  device: PicnicDevice;
  sourceTransportId: string;
}

async function resumeConsumer(
  ws: PicnicWebSocket,
  transport: PicnicTransport,
  consumer: types.Consumer,
): Promise<void> {
  await ws.send("/sfu/receive/state", {
    state: "play",
    transportId: transport.getId(),
    consumerId: consumer.id,
  });
  consumer.resume();
}

async function pauseConsumer(
  ws: PicnicWebSocket,
  transport: PicnicTransport,
  consumer: types.Consumer,
): Promise<void> {
  await ws.send("/sfu/receive/state", {
    state: "pause",
    transportId: transport.getId(),
    consumerId: consumer.id,
  });
  consumer.pause();
}

async function createConsumer(
  ws: PicnicWebSocket,
  transport: PicnicTransport,
  device: PicnicDevice,
  sourceTransportId: string,
  producerId: string,
): Promise<{ consumer: types.Consumer; state: ConsumerState }> {
  const req: ReceiveParams = {
    transportId: transport.getId(),
    rtpCapabilities: device.getRtpCapabilities(),
    sourceTransportId,
    producerId,
  };

  const info = await ws.send<ConsumerInfo>("/sfu/receive/create", req);

  const consumer = await transport.consume({
    id: info.consumerId,
    producerId: info.producerId,
    kind: info.kind,
    rtpParameters: info.rtpParameters,
  });

  const state = await ws.send<ConsumerState>("/sfu/receive/state/get", {
    consumerId: info.consumerId,
    transportId: transport.getId(),
  });

  return { consumer, state };
}

const audioKind = "audio" as const;
const videoKind = "video" as const;

export type RecvStreamEvents = {
  state: PicnicEvent<
    "state",
    {
      state: Pick<
        ServerEvents["streamConsumer:state"]["data"],
        "score" | "producerScore" | "paused" | "producerPaused"
      >;
      kind: "audio" | "video";
    }
  >;
  ready: PicnicEvent<"ready", null>;
  "stream:pause": PicnicEvent<"stream:pause", { kind: "audio" | "video" }>;
  "stream:resume": PicnicEvent<"stream:resume", { kind: "audio" | "video" }>;
};

export interface IRecvStream extends EventTarget<RecvStreamEvents, "strict"> {
  getCreatedAt(): number;

  getId(): string;

  attachAudioEffect(el: HTMLAudioElement | null): () => void;

  attachVideoEffect(el: HTMLVideoElement | null): () => void;

  isAudioPaused(): boolean;

  isAudioEnabled(): boolean;

  isVideoEnabled(): boolean;

  isReady(): boolean;

  isReconnecting(): boolean;

  toggleAudio(): Promise<void>;

  toggleVideo(): Promise<void>;
}

export class RecvStream
  extends EventTarget<RecvStreamEvents, "strict">
  implements IRecvStream {
  _ws: PicnicWebSocket;

  _audioPaused: boolean = true;

  _videoPaused: boolean = true;

  _videoStream: MediaStream = new MediaStream();

  _audioStream: MediaStream = new MediaStream();

  _transport: PicnicTransport;

  _device: PicnicDevice;

  _audioConsumer: types.Consumer | null = null;

  _videoConsumer: types.Consumer | null = null;

  _audioState: ConsumerState = {
    score: 0,
    producerScore: 0,
    paused: false,
    producerPaused: false,
  };

  _videoState: ConsumerState = {
    score: 0,
    producerScore: 0,
    paused: false,
    producerPaused: false,
  };

  isReconnecting() {
    if (!this.isAudioPaused()) {
      if (
        this._audioState.score === 0 ||
        this._audioState.producerScore === 0
      ) {
        return true;
      }
    }

    if (!this.isVideoPaused()) {
      if (
        this._videoState.score === 0 ||
        this._videoState.producerScore === 0
      ) {
        return true;
      }
    }

    return false;
  }

  _sourceTransportId: string;

  // Used to order streams by reception order to prevent flickering
  _createdAt: number;

  constructor(options: RecvStreamOptions) {
    super();

    this._ws = options.ws;
    this._transport = options.transport;
    this._device = options.device;
    this._sourceTransportId = options.sourceTransportId;
    this._ws.addEventListener("streamConsumer:state", this._onQualityChange);
    this._createdAt = Date.now();
  }

  async destroy(): Promise<void> {
    // TODO: notify API?
    // Not needed from stream:delete event because sourceTransport closed ==> consumer closed server-side
    this._audioConsumer?.close();
    this._videoConsumer?.close();
    this._ws.removeEventListener("streamConsumer:state", this._onQualityChange);
  }

  getCreatedAt(): number {
    return this._createdAt;
  }

  _onQualityChange = (event: ServerEvents["streamConsumer:state"]): void => {
    const {
      score,
      consumerId,
      producerScore,
      paused,
      producerPaused,
    } = event.data;

    const state = { score, producerScore, paused, producerPaused };

    if (this._audioConsumer?.id === consumerId) {
      this._audioState = state;
      const evt = new PicnicEvent("state", { state, kind: audioKind });
      this.dispatchEvent(evt);
    }
    if (this._videoConsumer?.id === consumerId) {
      this._videoState = state;
      const evt = new PicnicEvent("state", { state, kind: videoKind });
      this.dispatchEvent(evt);
    }
  };

  getId(): string {
    return this._sourceTransportId;
  }

  async load(producerId: string): Promise<void> {
    if (this._videoConsumer?.producerId === producerId) {
      return;
    }
    if (this._audioConsumer?.producerId === producerId) {
      return;
    }

    const { consumer, state } = await createConsumer(
      this._ws,
      this._transport,
      this._device,
      this._sourceTransportId,
      producerId,
    );

    if (consumer.kind === "audio") {
      // TODO: If already exists (multiple audio per host)
      this._audioConsumer = consumer;
      this._audioState = state;
      this._audioStream.addTrack(consumer.track);
    } else {
      // TODO: If already exists (multiple video per host)
      this._videoConsumer = consumer;
      this._videoState = state;
      this._videoStream.addTrack(consumer.track);
    }

    if (this.isReady()) {
      this.dispatchEvent(new PicnicEvent("ready", null));
      await this.resume();
    }
  }

  isReady(): boolean {
    return this._videoConsumer !== null && this._audioConsumer !== null;
  }

  getAudioState(): ConsumerState {
    return this._audioState;
  }

  isAudioEnabled(): boolean {
    return !this._audioState.producerPaused;
  }

  isAudioPaused(): boolean {
    return this._audioPaused;
  }

  pauseAudio = debounce(
    async (): Promise<void> => {
      if (this._audioConsumer !== null) {
        await pauseConsumer(this._ws, this._transport, this._audioConsumer);
        this._audioPaused = true;
        this.dispatchEvent(
          new PicnicEvent("stream:pause", { kind: audioKind }),
        );
      }
    },
    300,
    { leading: true },
  );

  resumeAudio = debounce(
    async (): Promise<void> => {
      if (this._audioConsumer !== null) {
        await resumeConsumer(this._ws, this._transport, this._audioConsumer);
        this._audioPaused = false;
        this.dispatchEvent(
          new PicnicEvent("stream:resume", { kind: audioKind }),
        );
      }
    },
    300,
    { leading: true },
  );

  async toggleAudio(): Promise<void> {
    return this.isAudioPaused() ? this.resumeAudio() : this.pauseAudio();
  }

  getVideoState(): ConsumerState {
    return this._videoState;
  }

  isVideoPaused(): boolean {
    return this._videoPaused;
  }

  isVideoEnabled(): boolean {
    return !this._videoState.producerPaused;
  }

  pauseVideo = debounce(
    async (): Promise<void> => {
      if (this._videoConsumer !== null) {
        await pauseConsumer(this._ws, this._transport, this._videoConsumer);
        this._videoPaused = true;
        this.dispatchEvent(
          new PicnicEvent("stream:pause", { kind: videoKind }),
        );
      }
    },
    300,
    { leading: true },
  );

  resumeVideo = debounce(
    async (): Promise<void> => {
      if (this._videoConsumer !== null) {
        await resumeConsumer(this._ws, this._transport, this._videoConsumer);
        this._videoPaused = false;
        this.dispatchEvent(
          new PicnicEvent("stream:resume", { kind: videoKind }),
        );
      }
    },
    300,
    { leading: true },
  );

  async toggleVideo(): Promise<void> {
    return this.isVideoPaused() ? this.resumeVideo() : this.pauseVideo();
  }

  async resume(): Promise<void> {
    await Promise.all([this.resumeAudio(), this.resumeVideo()]);
  }

  async pause(): Promise<void> {
    await Promise.all([this.pauseAudio(), this.pauseVideo()]);
  }

  getVideoStream(): MediaStream {
    // TODO: if not load?
    return this._videoStream;
  }

  getAudioStream(): MediaStream {
    // TODO: if not load?
    return this._audioStream;
  }

  attachAudioEffect = (el: HTMLAudioElement | null) => {
    if (el === null) {
      return () => {
        // no-op
      };
    }

    const autoPlay = () => {
      document.removeEventListener("click", autoPlay);

      el.play().catch((e) => {
        if (e.name === "NotAllowedError") {
          document.addEventListener("click", autoPlay, false);
        } else {
          captureException(e);
        }
      });
    };

    // eslint-disable-next-line no-param-reassign
    el.onloadedmetadata = autoPlay;
    // eslint-disable-next-line no-param-reassign
    el.srcObject = this._audioStream;

    return () => {
      document.removeEventListener("click", autoPlay);
      // eslint-disable-next-line no-param-reassign
      el.srcObject = null;
    };
  };

  attachVideoEffect = (el: HTMLVideoElement | null) => {
    if (el === null) {
      return () => {
        // no-op
      };
    }

    const autoPlay = () => {
      document.removeEventListener("click", autoPlay);

      el.play().catch((e) => {
        if (e.name === "NotAllowedError") {
          document.addEventListener("click", autoPlay, false);
        } else {
          captureException(e);
        }
      });
    };

    // eslint-disable-next-line no-param-reassign
    el.onloadedmetadata = autoPlay;
    // eslint-disable-next-line no-param-reassign
    el.srcObject = this._videoStream;
    // eslint-disable-next-line no-param-reassign
    el.muted = true;
    autoPlay();

    return () => {
      document.removeEventListener("click", autoPlay);
      // eslint-disable-next-line no-param-reassign
      el.srcObject = null;
    };
  };
}
