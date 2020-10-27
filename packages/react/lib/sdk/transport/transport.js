import { captureException } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import PicnicError from "../../exceptions/PicnicError";
import { PicnicEvent } from "../events/event";
export class PicnicTransport extends EventTarget {
    constructor(ws, device, type) {
        super();
        this.#transport = null;
        this.#state = "initial";
        this.#setState = (state) => {
            this.#state = state;
            const evt = new PicnicEvent("state:change", state);
            this.dispatchEvent(evt);
        };
        this.#onConnect = async ({ dtlsParameters }, callback, errback) => {
            try {
                if (!this.#transport) {
                    throw new PicnicError("PicnicTransport.ensureTransport: transport must exists", null);
                }
                const connectParams = {
                    transportId: this.#transport.id,
                    dtlsParameters,
                };
                await this.#ws.send("/sfu/connect/create", connectParams);
                callback();
            }
            catch (e) {
                captureException(e);
                errback(e);
            }
        };
        this.#onConnectionStateChange = (e) => {
            if (e === "disconnected") {
                this.#setState("disconnected");
            }
            else if (e === "connected") {
                this.#setState("connected");
            }
            else if (e === "connecting") {
                this.#setState("connecting");
            }
            else {
                console.warn("transport connection changes", e);
            }
        };
        this.#onProduce = async ({ kind, rtpParameters, }, callback, errback) => {
            try {
                if (!this.#transport) {
                    throw new PicnicError("PicnicTransport.ensureTransport: transport must exists", null);
                }
                const req = {
                    transportId: this.#transport.id,
                    kind,
                    rtpParameters,
                };
                const producerId = await this.#ws.send("/sfu/send/create", req);
                callback({ id: producerId });
            }
            catch (error) {
                captureException(error);
                errback(error);
            }
        };
        this.#ws = ws;
        this.#device = device;
        this.#type = type;
    }
    #ws;
    #device;
    #type;
    #transport;
    #state;
    getState() {
        return this.#state;
    }
    #setState;
    async destroy() {
        // TODO: notify when is user initiated
        this.#transport?.close();
    }
    getId() {
        if (this.#transport === null) {
            throw new PicnicError("PicnicTransport.getId: transport is not loaded yet", null);
        }
        return this.#transport.id;
    }
    async load() {
        this.#setState("creating");
        try {
            const { transportId, iceParameters, iceCandidates, dtlsParameters, sctpParameters, } = await this.#ws.send("/sfu/connect/init", this.#device.getInitConnectionParams(this.#type));
            const params = {
                id: transportId,
                iceParameters,
                iceCandidates: iceCandidates,
                dtlsParameters,
                sctpParameters,
                iceServers: [],
            };
            this.#transport = this.#device.createMediasoupTransport(this.#type, params);
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.#transport.on("connect", this.#onConnect);
            this.#transport.on("connectionstatechange", this.#onConnectionStateChange);
            if (this.#type === "send") {
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                this.#transport.on("produce", this.#onProduce);
            }
            this.#setState("connected");
        }
        catch (e) {
            this.#setState("error");
            throw new PicnicError("PicnicTransport.load: fail", e);
        }
    }
    async produce(options) {
        if (this.#transport === null || this.#type !== "send") {
            throw new PicnicError("PicnicTransport.produce: requires a send transport", null);
        }
        return this.#transport.produce(options);
    }
    async consume(options) {
        if (this.#transport === null || this.#type !== "recv") {
            throw new PicnicError("PicnicTransport.consume: requires a recv transport", null);
        }
        return this.#transport.consume(options);
    }
    #onConnect;
    #onConnectionStateChange;
    #onProduce;
}
//# sourceMappingURL=transport.js.map