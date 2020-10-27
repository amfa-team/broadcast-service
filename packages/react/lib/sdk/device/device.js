import { EventTarget } from "event-target-shim";
import { Device } from "mediasoup-client";
import PicnicError from "../../exceptions/PicnicError";
import { PicnicEvent } from "../events/event";
export class PicnicDevice extends EventTarget {
    constructor(ws) {
        super();
        this.#state = "initial";
        this.#device = new Device();
        this.#ensureIsLoaded = () => {
            if (!this.#device.loaded) {
                throw new PicnicError("PicnicDevice.getInitConnectionParams: Device must be loaded", null);
            }
        };
        this.#ws = ws;
    }
    #state;
    #device;
    #ws;
    getState() {
        return this.#state;
    }
    setState(state) {
        this.#state = state;
        const event = new PicnicEvent("state:change", this.getState());
        this.dispatchEvent(event);
    }
    // eslint-disable-next-line class-methods-use-this
    async destroy() {
        // Nothing to destroy
    }
    async loadDevice() {
        this.setState("loading");
        try {
            const routerRtpCapabilities = await this.#ws.send("/sfu/router-capabilities", null);
            await this.#device.load({ routerRtpCapabilities });
            this.setState("ready");
        }
        catch (e) {
            this.setState("error");
            throw new PicnicError("PicnicDevice.loadDevice: fail", e);
        }
    }
    #ensureIsLoaded;
    getInitConnectionParams(type) {
        this.#ensureIsLoaded();
        return {
            type,
            sctpCapabilities: this.#device.sctpCapabilities,
        };
    }
    getRtpCapabilities() {
        this.#ensureIsLoaded();
        return this.#device.rtpCapabilities;
    }
    createMediasoupTransport(type, params) {
        this.#ensureIsLoaded();
        return type === "send"
            ? this.#device.createSendTransport(params)
            : this.#device.createRecvTransport(params);
    }
}
//# sourceMappingURL=device.js.map