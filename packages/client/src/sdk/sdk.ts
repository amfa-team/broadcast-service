import { StreamInfo } from "../../../types";
import { Settings, SDKState } from "../types";
import { PicnicWebSocket } from "./websocket/websocket";
import { PicnicDevice } from "./device/device";
import SendStream from "./stream/SendStream";
import { PicnicTransport } from "./transport/transport";
import RecvStream from "./stream/RecvStream";
import { ServerEventMap, PicnicEvent } from "./events/event";
import { captureException } from "@sentry/react";

export const initialState: SDKState = {
  websocket: "initial",
  device: "initial",
  recvTransport: "initial",
  sendTransport: "initial",
};

export class Picnic extends EventTarget {
  #state: SDKState = initialState;

  #recvStreams: Map<string, RecvStream> = new Map();

  #device: PicnicDevice;

  #ws: PicnicWebSocket;

  #sendTransport: PicnicTransport | null = null;

  #recvTransport: PicnicTransport;

  constructor(settings: Settings) {
    super();

    this.#ws = new PicnicWebSocket(settings);
    this.#device = new PicnicDevice(this.#ws);
    this.#recvTransport = new PicnicTransport(this.#ws, this.#device, "recv");

    this.#ws.addEventListener("state:change", this.#onStateChange);
    this.#device.addEventListener("state:change", this.#onStateChange);
    this.#recvTransport.addEventListener("state:change", this.#onStateChange);
  }

  getState(): SDKState {
    return this.#state;
  }

  #onStateChange = (): void => {
    this.#state = {
      websocket: this.#ws.getState(),
      device: this.#device.getState(),
      recvTransport: this.#recvTransport.getState(),
      sendTransport: this.#sendTransport?.getState() ?? "initial",
    };

    const event = new PicnicEvent("state:change", this.#state);
    this.dispatchEvent(event);
  };

  async destroy(): Promise<void> {
    this.#ws.removeEventListener("state:change", this.#onStateChange);
    this.#device.removeEventListener("state:change", this.#onStateChange);
    this.#recvTransport.removeEventListener(
      "state:change",
      this.#onStateChange
    );
    this.#sendTransport?.removeEventListener(
      "state:change",
      this.#onStateChange
    );
    await this.#device.destroy();
    await this.#recvStreams.forEach((s) => this.#removeStream(s.getId()));
    await this.#recvTransport.destroy();
    await this.#sendTransport?.destroy();
    await this.#ws.destroy();
  }

  getStreams(): Map<string, RecvStream> {
    return this.#recvStreams;
  }

  #updateStreams = async (): Promise<void> => {
    const removedEvents: Array<ServerEventMap["stream:remove"]["data"]> = [];
    const watchRemoved = (event: Event) => {
      const { data } = event as ServerEventMap["stream:remove"];
      removedEvents.push(data);
    };
    this.#ws.addEventListener("stream:remove", watchRemoved);

    const infos = await this.#ws.send<StreamInfo[]>("/sfu/send/list", null);
    await Promise.all(infos.map(this.#addStream));
    this.#ws.removeEventListener("stream:remove", watchRemoved);

    // replay received remove events
    await Promise.all(removedEvents.map(this.#removeStream));
  };

  async load(): Promise<void> {
    await this.#ws.load();
    await this.#device.loadDevice();
    await this.#recvTransport.load();

    this.#ws.addEventListener("stream:add", async (event) => {
      const { data } = event as ServerEventMap["stream:add"];
      await this.#addStream(data);
    });
    this.#ws.addEventListener("stream:remove", (event) => {
      const { data } = event as ServerEventMap["stream:remove"];
      this.#removeStream(data);
    });

    await this.#updateStreams();
  }

  #addStream = async (info: StreamInfo): Promise<void> => {
    try {
      const { transportId, producerId } = info;

      if (this.#sendTransport?.getId() === transportId) {
        // ignore self stream
        return;
      }

      const recvStream =
        this.#recvStreams.get(transportId) ??
        new RecvStream({
          transport: this.#recvTransport,
          device: this.#device,
          ws: this.#ws,
          sourceTransportId: transportId,
        });

      this.#recvStreams.set(transportId, recvStream);

      await recvStream.load(producerId);

      // Might not be ready if only one of audio/video track is loaded
      if (recvStream.isReady()) {
        const evt = new MessageEvent("stream:update", {
          data: this.#recvStreams,
        });
        this.dispatchEvent(evt);
      }
    } catch (error) {
      // TODO: handle error
      console.error("Unable to receive stream", { error, info });
      captureException(error);
    }
  };

  #removeStream = async (sourceTransportId: string): Promise<void> => {
    const recvStream = this.#recvStreams.get(sourceTransportId);
    if (!recvStream) {
      return;
    }

    recvStream.destroy();
    this.#recvStreams.delete(sourceTransportId);
    const evt = new MessageEvent("stream:update", {
      data: this.#recvStreams,
    });
    this.dispatchEvent(evt);
  };

  async broadcast(): Promise<SendStream> {
    if (this.#sendTransport === null) {
      this.#sendTransport = new PicnicTransport(this.#ws, this.#device, "send");
      this.#sendTransport.addEventListener("state:change", this.#onStateChange);
      await this.#sendTransport.load();
    }
    const broadcastStream = new SendStream(this.#sendTransport, this.#ws);

    await broadcastStream.load();

    return broadcastStream;
  }
}
