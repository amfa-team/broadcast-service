import type {
  ConnectParams,
  ConnectionInfo,
  SendParams,
} from "@amfa-team/broadcast-service-types";
import { captureException } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import type { types } from "mediasoup-client";
import PicnicError from "../../exceptions/PicnicError";
import type { TransportState } from "../../types";
import type { PicnicDevice } from "../device/device";
import { PicnicEvent } from "../events/event";
import type { PicnicWebSocket } from "../websocket/websocket";

type TransportType = "send" | "recv";

export type TransportEvents = {
  "state:change": PicnicEvent<"state:change", TransportState>;
};

export class PicnicTransport extends EventTarget<TransportEvents, "strict"> {
  _ws: PicnicWebSocket;

  _device: PicnicDevice;

  _type: TransportType;

  _transport: types.Transport | null = null;

  _state: TransportState = "initial";

  constructor(ws: PicnicWebSocket, device: PicnicDevice, type: TransportType) {
    super();

    this._ws = ws;
    this._device = device;
    this._type = type;
  }

  getState(): TransportState {
    return this._state;
  }

  _setState = (state: TransportState): void => {
    this._state = state;
    const evt = new PicnicEvent("state:change", state);
    this.dispatchEvent(evt);
  };

  async destroy(): Promise<void> {
    // TODO: notify when is user initiated
    this._transport?.close();
  }

  getId(): string {
    if (this._transport === null) {
      throw new PicnicError(
        "PicnicTransport.getId: transport is not loaded yet",
        null,
      );
    }

    return this._transport.id;
  }

  async load(): Promise<void> {
    this._setState("creating");

    try {
      const {
        transportId,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
      } = await this._ws.send<ConnectionInfo>(
        "/sfu/connect/init",
        this._device.getInitConnectionParams(this._type),
      );

      const params = {
        id: transportId,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
        iceServers: [],
      };

      this._transport = this._device.createMediasoupTransport(
        this._type,
        params,
      );

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._transport.on("connect", this._onConnect);
      this._transport.on(
        "connectionstatechange",
        this._onConnectionStateChange,
      );
      if (this._type === "send") {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this._transport.on("produce", this._onProduce);
      }

      this._setState("connected");
    } catch (e) {
      this._setState("error");
      throw new PicnicError("PicnicTransport.load: fail", e);
    }
  }

  async produce(
    options: types.ProducerOptions & { track: MediaStreamTrack },
  ): Promise<types.Producer> {
    if (this._transport === null || this._type !== "send") {
      throw new PicnicError(
        "PicnicTransport.produce: requires a send transport",
        null,
      );
    }

    return this._transport.produce(options);
  }

  async consume(options: types.ConsumerOptions): Promise<types.Consumer> {
    if (this._transport === null || this._type !== "recv") {
      throw new PicnicError(
        "PicnicTransport.consume: requires a recv transport",
        null,
      );
    }

    return this._transport.consume(options);
  }

  _onConnect = async (
    { dtlsParameters }: { dtlsParameters: types.DtlsParameters },
    callback: () => void,
    errback: (e: Error) => void,
  ): Promise<void> => {
    try {
      if (!this._transport) {
        throw new PicnicError(
          "PicnicTransport.ensureTransport: transport must exists",
          null,
        );
      }
      const connectParams: ConnectParams = {
        transportId: this._transport.id,
        dtlsParameters,
      };
      await this._ws.send<ConnectionInfo>("/sfu/connect/create", connectParams);
      callback();
    } catch (e) {
      captureException(e);
      errback(e);
    }
  };

  _onConnectionStateChange = (e: unknown): void => {
    if (e === "disconnected") {
      this._setState("disconnected");
    } else if (e === "connected") {
      this._setState("connected");
    } else if (e === "connecting") {
      this._setState("connecting");
    } else {
      console.warn("transport connection changes", e);
    }
  };

  _onProduce = async (
    {
      kind,
      rtpParameters,
    }: { kind: types.MediaKind; rtpParameters: types.RtpParameters },
    callback: (p: { id: string }) => void,
    errback: (e: Error) => void,
  ): Promise<void> => {
    try {
      if (!this._transport) {
        throw new PicnicError(
          "PicnicTransport.ensureTransport: transport must exists",
          null,
        );
      }
      const req: SendParams = {
        transportId: this._transport.id,
        kind,
        rtpParameters,
      };

      const producerId = await this._ws.send<string>("/sfu/send/create", req);

      callback({ id: producerId });
    } catch (error) {
      captureException(error);
      errback(error);
    }
  };
}
