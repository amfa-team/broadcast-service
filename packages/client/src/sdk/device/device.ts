import { Device, types } from "mediasoup-client";
import { PicnicWebSocket } from "../websocket/websocket";
import { InitConnectionParams } from "../../../../types";

export class PicnicDevice {
  #device: types.Device = new Device();

  #ws: PicnicWebSocket;

  constructor(ws: PicnicWebSocket) {
    this.#ws = ws;
  }

  destroy(): void {
    // Nothing to destroy
  }

  async loadDevice(): Promise<void> {
    const routerRtpCapabilities = await this.#ws.send<types.RtpCapabilities>(
      "/sfu/router-capabilities",
      null
    );

    await this.#device.load({ routerRtpCapabilities });
  }

  #ensureIsLoaded = (): void => {
    if (!this.#device.loaded) {
      throw new Error(
        "PicnicDevice.getInitConnectionParams: Device must be loaded"
      );
    }
  };

  getInitConnectionParams(type: "send" | "recv"): InitConnectionParams {
    this.#ensureIsLoaded();

    return {
      type,
      sctpCapabilities: this.#device.sctpCapabilities,
    };
  }

  getRtpCapabilities(): types.RtpCapabilities {
    this.#ensureIsLoaded();

    return this.#device.rtpCapabilities;
  }

  createMediasoupTransport(
    type: "send" | "recv",
    params: types.TransportOptions
  ): types.Transport {
    this.#ensureIsLoaded();
    return type === "send"
      ? this.#device.createSendTransport(params)
      : this.#device.createRecvTransport(params);
  }
}
