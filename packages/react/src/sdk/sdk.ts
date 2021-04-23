import type { StreamInfo } from "@amfa-team/broadcast-service-types";
import { captureException } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import { detectDevice } from "mediasoup-client";
import type { SDKState, Settings } from "../types";
import { PicnicDevice } from "./device/device";
import type { ServerEvents } from "./events/event";
import { PicnicEvent } from "./events/event";
import type { IRecvStream } from "./stream/RecvStream";
import { RecvStream } from "./stream/RecvStream";
import type { ISendStream } from "./stream/SendStream";
import SendStream from "./stream/SendStream";
import { PicnicTransport } from "./transport/transport";
import { PicnicWebSocket } from "./websocket/websocket";

export const initialState: SDKState = {
  websocket: "initial",
  device: "initial",
  recvTransport: "initial",
  sendTransport: "initial",
};

export type SdkEvents = {
  "state:change": PicnicEvent<"state:change", SDKState>;
  "stream:update": PicnicEvent<"stream:update", IRecvStream[]>;
  "broadcast:init": PicnicEvent<"broadcast:init", null>;
  "broadcast:start": PicnicEvent<"broadcast:start", null>;
  "broadcast:stop": PicnicEvent<"broadcast:stop", null>;
  destroy: PicnicEvent<"destroy", null>;
};

export interface IBroadcastSdk extends EventTarget<SdkEvents, "strict"> {
  getRecvStreams(): IRecvStream[];

  getBroadcastStream(): ISendStream | null;

  setMainRecvStream(id: string | null): void;

  broadcast(): Promise<ISendStream>;

  destroy(): Promise<void>;
}

export class Picnic
  extends EventTarget<SdkEvents, "strict">
  implements IBroadcastSdk {
  _state: SDKState = initialState;

  _recvStreams: Map<string, RecvStream> = new Map();

  _device: PicnicDevice;

  _ws: PicnicWebSocket;

  _sendTransport: PicnicTransport | null = null;

  _recvTransport: PicnicTransport;

  _broadcastStream: SendStream | null = null;

  _mainRecvStream: string | null = null;

  _detectedDevice: string | null = detectDevice() ?? null;

  constructor(token: string, settings: Settings) {
    super();

    // @ts-ignore
    window.Picnic = this;

    this._ws = new PicnicWebSocket(token, settings);
    this._device = new PicnicDevice(this._ws);
    this._recvTransport = new PicnicTransport(this._ws, this._device, "recv");

    this._ws.addEventListener("state:change", this._onStateChange);
    this._device.addEventListener("state:change", this._onStateChange);
    this._recvTransport.addEventListener("state:change", this._onStateChange);
  }

  getState(): SDKState {
    return this._state;
  }

  _onStateChange = (): void => {
    this._state = {
      websocket: this._ws.getState(),
      device: this._device.getState(),
      recvTransport: this._recvTransport.getState(),
      sendTransport: this._sendTransport?.getState() ?? "initial",
    };

    const event = new PicnicEvent<"state:change", SDKState>(
      "state:change",
      this._state,
    );
    this.dispatchEvent(event);
  };

  async destroy(): Promise<void> {
    this._ws.removeEventListener("state:change", this._onStateChange);
    this._device.removeEventListener("state:change", this._onStateChange);
    this._recvTransport.removeEventListener(
      "state:change",
      this._onStateChange,
    );
    this._sendTransport?.removeEventListener(
      "state:change",
      this._onStateChange,
    );
    this._broadcastStream?.removeEventListener("start", this._onBroadcastStart);
    this._broadcastStream?.removeEventListener(
      "destroy",
      this._onBroadcastDestroy,
    );

    await this._device.destroy();
    await Promise.all(
      Array.from(this._recvStreams.values()).map(async (s) =>
        this._removeStream(s.getId()),
      ),
    );
    await this._recvTransport.destroy();
    await this._sendTransport?.destroy();
    await this._ws.destroy();

    this.dispatchEvent(new PicnicEvent("destroy", null));
  }

  getBroadcastStream(): SendStream | null {
    return this._broadcastStream;
  }

  getStreams(): Map<string, RecvStream> {
    return this._recvStreams;
  }

  setMainRecvStream(id: string | null): void {
    this._mainRecvStream = id;
    const evt = new PicnicEvent("stream:update", this.getRecvStreams());
    this.dispatchEvent(evt);
  }

  getRecvStreams(): RecvStream[] {
    return Array.from(this.getStreams().values()).sort((a, b) => {
      if (a.getId() === this._mainRecvStream) {
        return -1;
      }

      if (b.getId() === this._mainRecvStream) {
        return 1;
      }

      return a.getCreatedAt() - b.getCreatedAt();
    });
  }

  _updateStreams = async (): Promise<void> => {
    const removedEvents: Array<ServerEvents["stream:remove"]["data"]> = [];
    const watchRemoved = ({ data }: ServerEvents["stream:remove"]) => {
      removedEvents.push(data);
    };
    this._ws.addEventListener("stream:remove", watchRemoved);

    const infos = await this._ws.send<StreamInfo[]>("/sfu/send/list", null);
    await Promise.all(infos.map(this._addStream));
    this._ws.removeEventListener("stream:remove", watchRemoved);

    // replay received remove events
    await Promise.all(removedEvents.map(this._removeStream));
  };

  deviceSupported(): boolean {
    return !!this._detectedDevice;
  }

  async load(): Promise<void> {
    await this._ws.load();
    await this._device.loadDevice();
    await this._recvTransport.load();

    this._ws.addEventListener(
      "stream:add",
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async ({ data }: ServerEvents["stream:add"]) => {
        await this._addStream(data);
      },
    );
    this._ws.addEventListener(
      "stream:remove",
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async ({ data }: ServerEvents["stream:remove"]) => {
        await this._removeStream(data);
      },
    );

    await this._updateStreams();
  }

  _addStream = async (info: StreamInfo): Promise<void> => {
    try {
      const { transportId, producerId } = info;

      if (this._sendTransport?.getId() === transportId) {
        // ignore self stream
        return;
      }

      const recvStream =
        this._recvStreams.get(transportId) ??
        new RecvStream({
          transport: this._recvTransport,
          device: this._device,
          ws: this._ws,
          sourceTransportId: transportId,
        });

      this._recvStreams.set(transportId, recvStream);

      await recvStream.load(producerId);

      // Might not be ready if only one of audio/video track is loaded
      if (recvStream.isReady()) {
        const evt = new PicnicEvent("stream:update", this.getRecvStreams());
        this.dispatchEvent(evt);
      }
    } catch (error) {
      // TODO: handle error
      console.error("Unable to receive stream", { error, info });
      captureException(error);
    }
  };

  _removeStream = async (sourceTransportId: string): Promise<void> => {
    const recvStream = this._recvStreams.get(sourceTransportId);
    if (!recvStream) {
      return;
    }

    await recvStream.destroy();
    this._recvStreams.delete(sourceTransportId);
    const evt = new PicnicEvent("stream:update", this.getRecvStreams());
    this.dispatchEvent(evt);
  };

  _onBroadcastStart = (): void => {
    const event = new PicnicEvent("broadcast:start", null);
    this.dispatchEvent(event);
  };

  _onBroadcastDestroy = (): void => {
    this._broadcastStream = null;
    const event = new PicnicEvent("broadcast:stop", null);
    this.dispatchEvent(event);
  };

  async broadcast(): Promise<SendStream> {
    if (this._sendTransport === null) {
      this._sendTransport = new PicnicTransport(this._ws, this._device, "send");
      this._sendTransport.addEventListener("state:change", this._onStateChange);
      await this._sendTransport.load();
    }

    if (this._broadcastStream === null) {
      const broadcastStream = new SendStream(this._sendTransport, this._ws);

      broadcastStream.addEventListener("start", this._onBroadcastStart);
      broadcastStream.addEventListener("destroy", this._onBroadcastDestroy);

      this._broadcastStream = broadcastStream;
      this.dispatchEvent(new PicnicEvent("broadcast:init", null));
      try {
        await broadcastStream.load();
        return broadcastStream;
      } catch (e) {
        this._onBroadcastDestroy();
        throw e;
      }
    }

    return this._broadcastStream;
  }
}
