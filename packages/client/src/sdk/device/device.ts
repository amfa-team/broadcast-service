import { Device, types } from "mediasoup-client";
import { PicnicWebSocket } from "../websocket/websocket";
import { InitConnectionParams } from "../../../../types";
import { DeviceState } from "../../types";
import { PicnicEvent } from "../events/event";
import PicnicError from "../../exceptions/PicnicError";

export class PicnicDevice extends EventTarget {
  #state: DeviceState = "initial";

  #device: types.Device = new Device();

  #ws: PicnicWebSocket;

  constructor(ws: PicnicWebSocket) {
    super();

    this.#ws = ws;
  }

  getState(): DeviceState {
    return this.#state;
  }

  setState(state: DeviceState): void {
    this.#state = state;
    const event = new PicnicEvent("state:change", this.getState());
    this.dispatchEvent(event);
  }

  async destroy(): Promise<void> {
    // Nothing to destroy
  }

  async loadDevice(): Promise<void> {
    this.setState("loading");
    try {
      const routerRtpCapabilities = await this.#ws.send<types.RtpCapabilities>(
        "/sfu/router-capabilities",
        null
      );

      await this.#device.load({ routerRtpCapabilities });
      this.setState("ready");
    } catch (e) {
      this.setState("error");
      throw new PicnicError("PicnicDevice.loadDevice: fail", e);
    }
  }

  #ensureIsLoaded = (): void => {
    if (!this.#device.loaded) {
      throw new PicnicError(
        "PicnicDevice.getInitConnectionParams: Device must be loaded",
        null
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
