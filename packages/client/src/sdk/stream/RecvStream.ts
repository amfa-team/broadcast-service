import { types } from "mediasoup-client";
import { PicnicTransport } from "../transport/transport";
import { PicnicDevice } from "../device/device";
import { PicnicWebSocket } from "../websocket/websocket";
import { ReceiveParams, ConsumerInfo, ConsumerState } from "../../../../types";
import { PicnicEvent, ServerEventMap } from "../events/event";

interface RecvStreamOptions {
  ws: PicnicWebSocket;
  transport: PicnicTransport;
  device: PicnicDevice;
  sourceTransportId: string;
}

async function resumeConsumer(
  ws: PicnicWebSocket,
  transport: PicnicTransport,
  consumer: types.Consumer
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
  consumer: types.Consumer
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
  producerId: string
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

export default class RecvStream extends EventTarget {
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

  constructor(options: RecvStreamOptions) {
    super();

    this.#ws = options.ws;
    this.#transport = options.transport;
    this.#device = options.device;
    this.#sourceTransportId = options.sourceTransportId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.#ws.addEventListener(
      "streamConsumer:state",
      this.#onQualityChange as any
    );
  }

  async destroy(): Promise<void> {
    // TODO: notify API?
    // Not needed from stream:delete event because sourceTransport closed ==> consumer closed server-side
    this.#audioConsumer?.close();
    this.#videoConsumer?.close();
    this.#ws.removeEventListener(
      "streamConsumer:state",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.#onQualityChange as any
    );
  }

  #onQualityChange = (event: ServerEventMap["streamConsumer:state"]): void => {
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
      const evt = new PicnicEvent("state", { state, kind: "audio" });
      this.dispatchEvent(evt);
    }
    if (this.#videoConsumer?.id === consumerId) {
      this.#videoState = state;
      const evt = new PicnicEvent("state", { state, kind: "video" });
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
      producerId
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
      this.dispatchEvent(new PicnicEvent("stream:pause", { kind: "audio" }));
    }
  }

  async resumeAudio(): Promise<void> {
    if (this.#audioConsumer !== null) {
      await resumeConsumer(this.#ws, this.#transport, this.#audioConsumer);
      this.dispatchEvent(new PicnicEvent("stream:resume", { kind: "audio" }));
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
      this.dispatchEvent(new PicnicEvent("stream:pause", { kind: "video" }));
    }
  }

  async resumeVideo(): Promise<void> {
    if (this.#videoConsumer !== null) {
      await resumeConsumer(this.#ws, this.#transport, this.#videoConsumer);
      this.dispatchEvent(new PicnicEvent("stream:resume", { kind: "video" }));
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
