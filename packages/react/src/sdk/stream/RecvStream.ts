import type {
  ConsumerInfo,
  ConsumerState,
  ReceiveParams,
} from "@amfa-team/broadcast-service-types";
import { EventTarget } from "event-target-shim";
import type { types } from "mediasoup-client";
import type { PicnicDevice } from "../device/device";
import type { Empty, ServerEvents } from "../events/event";
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
  state: PicnicEvent<{
    state: Pick<
      ServerEvents["streamConsumer:state"]["data"],
      "score" | "producerScore" | "paused" | "producerPaused"
    >;
    kind: "audio" | "video";
  }>;
  "stream:pause": PicnicEvent<{ kind: "audio" | "video" }>;
  "stream:resume": PicnicEvent<{ kind: "audio" | "video" }>;
};

export class RecvStream extends EventTarget<RecvStreamEvents, Empty, "strict"> {
  #ws: PicnicWebSocket;

  #stream: MediaStream = new MediaStream();

  #transport: PicnicTransport;

  #device: PicnicDevice;

  #audioConsumer: types.Consumer | null = null;

  #videoConsumer: types.Consumer | null = null;

  #audioState: ConsumerState = {
    score: 0,
    producerScore: 0,
    paused: false,
    producerPaused: false,
  };

  #videoState: ConsumerState = {
    score: 0,
    producerScore: 0,
    paused: false,
    producerPaused: false,
  };

  #sourceTransportId: string;

  // Used to order streams by reception order to prevent flickering
  #createdAt: number;

  constructor(options: RecvStreamOptions) {
    super();

    this.#ws = options.ws;
    this.#transport = options.transport;
    this.#device = options.device;
    this.#sourceTransportId = options.sourceTransportId;
    this.#ws.addEventListener("streamConsumer:state", this.#onQualityChange);
    this.#createdAt = Date.now();
  }

  async destroy(): Promise<void> {
    // TODO: notify API?
    // Not needed from stream:delete event because sourceTransport closed ==> consumer closed server-side
    this.#audioConsumer?.close();
    this.#videoConsumer?.close();
    this.#ws.removeEventListener("streamConsumer:state", this.#onQualityChange);
  }

  getCreatedAt(): number {
    return this.#createdAt;
  }

  #onQualityChange = (event: ServerEvents["streamConsumer:state"]): void => {
    const {
      score,
      consumerId,
      producerScore,
      paused,
      producerPaused,
    } = event.data;

    const state = { score, producerScore, paused, producerPaused };

    if (this.#audioConsumer?.id === consumerId) {
      this.#audioState = state;
      const evt = new PicnicEvent("state", { state, kind: audioKind });
      this.dispatchEvent(evt);
    }
    if (this.#videoConsumer?.id === consumerId) {
      this.#videoState = state;
      const evt = new PicnicEvent("state", { state, kind: videoKind });
      this.dispatchEvent(evt);
    }
  };

  getId(): string {
    return this.#sourceTransportId;
  }

  async load(producerId: string): Promise<void> {
    if (this.#videoConsumer?.producerId === producerId) {
      return;
    }
    if (this.#audioConsumer?.producerId === producerId) {
      return;
    }

    const { consumer, state } = await createConsumer(
      this.#ws,
      this.#transport,
      this.#device,
      this.#sourceTransportId,
      producerId,
    );

    if (consumer.kind === "audio") {
      // TODO: If already exists (multiple audio per host)
      this.#audioConsumer = consumer;
      this.#audioState = state;
    } else {
      // TODO: If already exists (multiple video per host)
      this.#videoConsumer = consumer;
      this.#videoState = state;
    }

    this.#stream.addTrack(consumer.track);
  }

  isReady(): boolean {
    return this.#videoConsumer !== null && this.#audioConsumer !== null;
  }

  async pauseAudio(): Promise<void> {
    if (this.#audioConsumer !== null) {
      await pauseConsumer(this.#ws, this.#transport, this.#audioConsumer);
      this.dispatchEvent(new PicnicEvent("stream:pause", { kind: audioKind }));
    }
  }

  async resumeAudio(): Promise<void> {
    if (this.#audioConsumer !== null) {
      await resumeConsumer(this.#ws, this.#transport, this.#audioConsumer);
      this.dispatchEvent(new PicnicEvent("stream:resume", { kind: audioKind }));
    }
  }

  isAudioPaused(): boolean {
    return this.#audioConsumer?.paused ?? true;
  }

  getAudioState(): ConsumerState {
    return this.#audioState;
  }

  async pauseVideo(): Promise<void> {
    if (this.#videoConsumer !== null) {
      await pauseConsumer(this.#ws, this.#transport, this.#videoConsumer);
      this.dispatchEvent(new PicnicEvent("stream:pause", { kind: videoKind }));
    }
  }

  async resumeVideo(): Promise<void> {
    if (this.#videoConsumer !== null) {
      await resumeConsumer(this.#ws, this.#transport, this.#videoConsumer);
      this.dispatchEvent(new PicnicEvent("stream:resume", { kind: videoKind }));
    }
  }

  isVideoPaused(): boolean {
    return this.#videoConsumer?.paused ?? true;
  }

  getVideoState(): ConsumerState {
    return this.#videoState;
  }

  async resume(): Promise<void> {
    await Promise.all([this.resumeAudio(), this.resumeVideo()]);
  }

  async pause(): Promise<void> {
    await Promise.all([this.pauseAudio(), this.pauseVideo()]);
  }

  getMediaStream(): MediaStream {
    // TODO: if not load?
    return this.#stream;
  }
}
