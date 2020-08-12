import { types } from "mediasoup-client";
import { PicnicTransport } from "../transport/transport";
import { PicnicDevice } from "../device/device";
import { PicnicWebSocket } from "../websocket/websocket";
import { ReceiveParams, ConsumerInfo } from "../../../../types";

interface RecvStreamOptions {
  ws: PicnicWebSocket;
  transport: PicnicTransport;
  device: PicnicDevice;
  sourceTransportId: string;
}

async function resumeConsumer(
  ws: PicnicWebSocket,
  consumer: types.Consumer
): Promise<void> {
  await ws.send("/sfu/receive/play", { consumerId: consumer.id });
  consumer.resume();
}

async function pauseConsumer(
  ws: PicnicWebSocket,
  consumer: types.Consumer
): Promise<void> {
  await ws.send("/sfu/receive/pause", { consumerId: consumer.id });
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

  // TODO: Do not auto play
  await resumeConsumer(ws, consumer);

  return consumer;
}

export default class RecvStream {
  #ws: PicnicWebSocket;
  #stream: MediaStream = new MediaStream();
  #transport: PicnicTransport;
  #device: PicnicDevice;
  #audioConsumer: types.Consumer | null = null;
  #videoConsumer: types.Consumer | null = null;
  #sourceTransportId: string;

  constructor(options: RecvStreamOptions) {
    this.#ws = options.ws;
    this.#transport = options.transport;
    this.#device = options.device;
    this.#sourceTransportId = options.sourceTransportId;
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

    this.#stream.addTrack(consumer.track);
  }

  async pauseAudio(): Promise<void> {
    if (this.#audioConsumer === null) {
      throw new Error("RecvStream.pauseAudio: require consumer");
    }
    await pauseConsumer(this.#ws, this.#audioConsumer);
  }

  async resumeAudio(): Promise<void> {
    if (this.#audioConsumer === null) {
      throw new Error("RecvStream.resumeAudio: require consumer");
    }
    await resumeConsumer(this.#ws, this.#audioConsumer);
  }

  async pauseVideo(): Promise<void> {
    if (this.#videoConsumer === null) {
      throw new Error("RecvStream.pauseVideo: require consumer");
    }
    await pauseConsumer(this.#ws, this.#videoConsumer);
  }

  async resumeVideo(): Promise<void> {
    if (this.#videoConsumer === null) {
      throw new Error("RecvStream.resumeVideo: require consumer");
    }
    await resumeConsumer(this.#ws, this.#videoConsumer);
  }

  getMediaStream(): MediaStream {
    // TODO: if not load?
    return this.#stream;
  }

  unload(): void {
    // TODO: notify API?
    // Not needed from stream:delete event because sourceTransport closed ==> consumer closed server-side
    if (this.#audioConsumer) {
      this.#audioConsumer.close();
    }
    if (this.#videoConsumer) {
      this.#videoConsumer.close();
    }
  }
}
