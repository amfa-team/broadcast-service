import { StreamInfo } from "../../../types";
import { Settings } from "../types";
import { PicnicWebSocket } from "./websocket/websocket";
import { PicnicDevice } from "./device/device";
import SendStream from "./stream/SendStream";
import { PicnicTransport } from "./transport/transport";
import RecvStream from "./stream/RecvStream";
import { ServerEventMap } from "./events/event";

interface SDKEvent<T> extends Event {
  data: T;
}

type State = "initial" | "loading" | "ready";

interface SDKEventMap {
  state: SDKEvent<State>;
  "new-stream": SDKEvent<StreamInfo>;
}

interface SDK extends EventTarget {
  readonly state: State;

  addEventListener<K extends keyof SDKEventMap>(
    type: K,
    listener: (this: MessagePort, ev: SDKEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof SDKEventMap>(
    type: K,
    listener: (this: MessagePort, ev: SDKEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;

  load(): void;
}

export class Picnic extends EventTarget implements SDK {
  readonly state: State = "initial";

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
  }

  async destroy(): Promise<void> {
    await this.#device.destroy();
    await this.#recvStreams.forEach((s) => this.#removeStream(s.getId()));
    await this.#sendTransport?.destroy();
    await this.#recvTransport?.destroy();
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
      console.error("Unable to receive stream", { error, info });
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
      await this.#sendTransport.load();
    }
    const broadcastStream = new SendStream(this.#sendTransport, this.#ws);

    await broadcastStream.load();

    return broadcastStream;
  }
}
