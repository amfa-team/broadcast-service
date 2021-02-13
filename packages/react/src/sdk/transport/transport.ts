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
import type { Empty } from "../events/event";
import { PicnicEvent } from "../events/event";
import type { PicnicWebSocket } from "../websocket/websocket";

type TransportType = "send" | "recv";

export type TransportEvents = {
  "state:change": PicnicEvent<TransportState>;
};

export class PicnicTransport extends EventTarget<
  TransportEvents,
  Empty,
  "strict"
> {
  #ws: PicnicWebSocket;

  #device: PicnicDevice;

  #type: TransportType;

  #transport: types.Transport | null = null;

  #state: TransportState = "initial";

  constructor(ws: PicnicWebSocket, device: PicnicDevice, type: TransportType) {
    super();

    this.#ws = ws;
    this.#device = device;
    this.#type = type;
  }

  getState(): TransportState {
    return this.#state;
  }

  #setState = (state: TransportState): void => {
    this.#state = state;
    const evt = new PicnicEvent("state:change", state);
    this.dispatchEvent(evt);
  };

  async destroy(): Promise<void> {
    // TODO: notify when is user initiated
    this.#transport?.close();
  }

  getId(): string {
    if (this.#transport === null) {
      throw new PicnicError(
        "PicnicTransport.getId: transport is not loaded yet",
        null,
      );
    }

    return this.#transport.id;
  }

  async load(): Promise<void> {
    this.#setState("creating");

    try {
      const {
        transportId,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
      } = await this.#ws.send<ConnectionInfo>(
        "/sfu/connect/init",
        this.#device.getInitConnectionParams(this.#type),
      );

      const params = {
        id: transportId,
        iceParameters,
        iceCandidates: iceCandidates as types.IceCandidate[],
        dtlsParameters,
        sctpParameters,
        iceServers: [],
      };

      this.#transport = this.#device.createMediasoupTransport(
        this.#type,
        params,
      );

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.#transport.on("connect", this.#onConnect);
      this.#transport.on(
        "connectionstatechange",
        this.#onConnectionStateChange,
      );
      if (this.#type === "send") {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.#transport.on("produce", this.#onProduce);
      }

      this.#setState("connected");
    } catch (e) {
      this.#setState("error");
      throw new PicnicError("PicnicTransport.load: fail", e);
    }
  }

  async produce(
    options: types.ProducerOptions & { track: MediaStreamTrack },
  ): Promise<types.Producer> {
    if (this.#transport === null || this.#type !== "send") {
      throw new PicnicError(
        "PicnicTransport.produce: requires a send transport",
        null,
      );
    }

    return this.#transport.produce(options);
  }

  async consume(options: types.ConsumerOptions): Promise<types.Consumer> {
    if (this.#transport === null || this.#type !== "recv") {
      throw new PicnicError(
        "PicnicTransport.consume: requires a recv transport",
        null,
      );
    }

    return this.#transport.consume(options);
  }

  #onConnect = async (
    { dtlsParameters }: { dtlsParameters: types.DtlsParameters },
    callback: () => void,
    errback: (e: Error) => void,
  ): Promise<void> => {
    try {
      if (!this.#transport) {
        throw new PicnicError(
          "PicnicTransport.ensureTransport: transport must exists",
          null,
        );
      }
      const connectParams: ConnectParams = {
        transportId: this.#transport.id,
        dtlsParameters,
      };
      await this.#ws.send<ConnectionInfo>("/sfu/connect/create", connectParams);
      callback();
    } catch (e) {
      captureException(e);
      errback(e);
    }
  };

  #onConnectionStateChange = (e: unknown): void => {
    if (e === "disconnected") {
      this.#setState("disconnected");
    } else if (e === "connected") {
      this.#setState("connected");
    } else if (e === "connecting") {
      this.#setState("connecting");
    } else {
      console.warn("transport connection changes", e);
    }
  };

  #onProduce = async (
    {
      kind,
      rtpParameters,
    }: { kind: types.MediaKind; rtpParameters: types.RtpParameters },
    callback: (p: { id: string }) => void,
    errback: (e: Error) => void,
  ): Promise<void> => {
    try {
      if (!this.#transport) {
        throw new PicnicError(
          "PicnicTransport.ensureTransport: transport must exists",
          null,
        );
      }
      const req: SendParams = {
        transportId: this.#transport.id,
        kind,
        rtpParameters,
      };

      const producerId = await this.#ws.send<string>("/sfu/send/create", req);

      callback({ id: producerId });
    } catch (error) {
      captureException(error);
      errback(error);
    }
  };
}
