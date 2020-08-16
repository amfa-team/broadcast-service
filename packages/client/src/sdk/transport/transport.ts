import { types } from "mediasoup-client";
import { PicnicWebSocket } from "../websocket/websocket";
import { PicnicDevice } from "../device/device";
import { ConnectionInfo, ConnectParams, SendParams } from "../../../../types";

type TransportType = "send" | "recv";

export class PicnicTransport {
  #ws: PicnicWebSocket;

  #device: PicnicDevice;

  #type: TransportType;

  #transport: types.Transport | null = null;

  constructor(ws: PicnicWebSocket, device: PicnicDevice, type: TransportType) {
    this.#ws = ws;
    this.#device = device;
    this.#type = type;
  }

  destroy(): void {
    this.#transport?.close();
  }

  getId(): string {
    if (this.#transport === null) {
      throw new Error("PicnicTransport.getId: transport is not loaded yet");
    }

    return this.#transport.id;
  }

  async load(): Promise<void> {
    const {
      transportId,
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
    } = await this.#ws.send<ConnectionInfo>(
      "/sfu/connect/init",
      this.#device.getInitConnectionParams(this.#type)
    );

    const params = {
      id: transportId,
      iceParameters,
      iceCandidates: iceCandidates as types.IceCandidate[],
      dtlsParameters,
      sctpParameters,
      iceServers: [],
    };

    this.#transport = this.#device.createMediasoupTransport(this.#type, params);

    this.#transport.on("connect", this.#onConnect);
    this.#transport.on("connectionstatechange", this.#onConnectionStateChange);
    if (this.#type === "send") {
      this.#transport.on("produce", this.#onProduce);
    }
  }

  async produce(
    options: types.ProducerOptions & { track: MediaStreamTrack }
  ): Promise<types.Producer> {
    if (this.#transport === null || this.#type !== "send") {
      throw new Error("PicnicTransport.produce: requires a send transport");
    }

    return this.#transport.produce(options);
  }

  async consume(options: types.ConsumerOptions): Promise<types.Consumer> {
    if (this.#transport === null || this.#type !== "recv") {
      throw new Error("PicnicTransport.consume: requires a recv transport");
    }

    return this.#transport.consume(options);
  }

  #onConnect = async (
    { dtlsParameters }: { dtlsParameters: types.DtlsParameters },
    callback: () => void,
    errback: (e: Error) => void
  ): Promise<void> => {
    try {
      if (!this.#transport) {
        throw new Error(
          "PicnicTransport.ensureTransport: transport must exists"
        );
      }
      const connectParams: ConnectParams = {
        transportId: this.#transport.id,
        dtlsParameters,
      };
      await this.#ws.send<ConnectionInfo>("/sfu/connect/create", connectParams);
      callback();
    } catch (e) {
      errback(e);
    }
  };

  #onConnectionStateChange = (e: unknown): void => {
    console.warn("transport connection changed", e);
  };

  #onProduce = async (
    {
      kind,
      rtpParameters,
    }: { kind: types.MediaKind; rtpParameters: types.RtpParameters },
    callback: (p: { id: number }) => void,
    errback: (e: Error) => void
  ): Promise<void> => {
    try {
      if (!this.#transport) {
        throw new Error(
          "PicnicTransport.ensureTransport: transport must exists"
        );
      }
      const req: SendParams = {
        transportId: this.#transport.id,
        kind,
        rtpParameters,
      };

      const producerId = await this.#ws.send<number>("/sfu/send/create", req);

      callback({ id: producerId });
    } catch (error) {
      errback(error);
    }
  };
}
