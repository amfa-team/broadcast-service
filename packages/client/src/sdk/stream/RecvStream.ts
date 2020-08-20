import { types } from "mediasoup-client";
import { PicnicTransport } from "../transport/transport";
import { PicnicDevice } from "../device/device";
import { PicnicWebSocket } from "../websocket/websocket";
import { ReceiveParams, ConsumerInfo } from "../../../../types";
import { PicnicEvent } from "../events/event";

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
): Promise<types.Consumer> {
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

  return consumer;
}

export default class RecvStream extends EventTarget {
  #ws: PicnicWebSocket;
  #stream: MediaStream = new MediaStream();
  #transport: PicnicTransport;
  #device: PicnicDevice;
  #audioConsumer: types.Consumer | null = null;
  #videoConsumer: types.Consumer | null = null;
  #sourceTransportId: string;

  constructor(options: RecvStreamOptions) {
    super();

    this.#ws = options.ws;
    this.#transport = options.transport;
    this.#device = options.device;
    this.#sourceTransportId = options.sourceTransportId;
  }

  async destroy(): Promise<void> {
    // TODO: notify API?
    // Not needed from stream:delete event because sourceTransport closed ==> consumer closed server-side
    this.#audioConsumer?.close();
    this.#videoConsumer?.close();
  }

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

    const consumer = await createConsumer(
      this.#ws,
      this.#transport,
      this.#device,
      this.#sourceTransportId,
      producerId
    );

    if (consumer.kind === "audio") {
      // TODO: If already exists (multiple audio per host)
      this.#audioConsumer = consumer;
    } else {
      // TODO: If already exists (multiple video per host)
      this.#videoConsumer = consumer;
    }

    console.log(consumer);

    this.#stream.addTrack(consumer.track);
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
