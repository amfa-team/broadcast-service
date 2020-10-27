import { captureException } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import { PicnicDevice } from "./device/device";
import { PicnicEvent } from "./events/event";
import { RecvStream } from "./stream/RecvStream";
import SendStream from "./stream/SendStream";
import { PicnicTransport } from "./transport/transport";
import { PicnicWebSocket } from "./websocket/websocket";
export const initialState = {
    websocket: "initial",
    device: "initial",
    recvTransport: "initial",
    sendTransport: "initial",
};
export class Picnic extends EventTarget {
    constructor(settings) {
        super();
        this.#state = initialState;
        this.#recvStreams = new Map();
        this.#sendTransport = null;
        this.#broadcastStream = null;
        this.#onStateChange = () => {
            this.#state = {
                websocket: this.#ws.getState(),
                device: this.#device.getState(),
                recvTransport: this.#recvTransport.getState(),
                sendTransport: this.#sendTransport?.getState() ?? "initial",
            };
            const event = new PicnicEvent("state:change", this.#state);
            this.dispatchEvent(event);
        };
        this.#updateStreams = async () => {
            const removedEvents = [];
            const watchRemoved = ({ data }) => {
                removedEvents.push(data);
            };
            this.#ws.addEventListener("stream:remove", watchRemoved);
            const infos = await this.#ws.send("/sfu/send/list", null);
            await Promise.all(infos.map(this.#addStream));
            this.#ws.removeEventListener("stream:remove", watchRemoved);
            // replay received remove events
            await Promise.all(removedEvents.map(this.#removeStream));
        };
        this.#addStream = async (info) => {
            try {
                const { transportId, producerId } = info;
                if (this.#sendTransport?.getState() === "connected" &&
                    this.#sendTransport.getId() === transportId) {
                    // ignore self stream
                    return;
                }
                const recvStream = this.#recvStreams.get(transportId) ??
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
                    const evt = new PicnicEvent("stream:update", this.#recvStreams);
                    this.dispatchEvent(evt);
                }
            }
            catch (error) {
                // TODO: handle error
                console.error("Unable to receive stream", { error, info });
                captureException(error);
            }
        };
        this.#removeStream = async (sourceTransportId) => {
            const recvStream = this.#recvStreams.get(sourceTransportId);
            if (!recvStream) {
                return;
            }
            await recvStream.destroy();
            this.#recvStreams.delete(sourceTransportId);
            const evt = new PicnicEvent("stream:update", this.#recvStreams);
            this.dispatchEvent(evt);
        };
        this.#onBroadcastStart = () => {
            const event = new PicnicEvent("broadcast:start", null);
            this.dispatchEvent(event);
        };
        this.#onBroadcastStop = () => {
            const event = new PicnicEvent("broadcast:stop", null);
            this.dispatchEvent(event);
        };
        this.#ws = new PicnicWebSocket(settings);
        this.#device = new PicnicDevice(this.#ws);
        this.#recvTransport = new PicnicTransport(this.#ws, this.#device, "recv");
        this.#ws.addEventListener("state:change", this.#onStateChange);
        this.#device.addEventListener("state:change", this.#onStateChange);
        this.#recvTransport.addEventListener("state:change", this.#onStateChange);
    }
    #state;
    #recvStreams;
    #device;
    #ws;
    #sendTransport;
    #recvTransport;
    #broadcastStream;
    getState() {
        return this.#state;
    }
    #onStateChange;
    async destroy() {
        this.#ws.removeEventListener("state:change", this.#onStateChange);
        this.#device.removeEventListener("state:change", this.#onStateChange);
        this.#recvTransport.removeEventListener("state:change", this.#onStateChange);
        this.#sendTransport?.removeEventListener("state:change", this.#onStateChange);
        this.#broadcastStream?.removeEventListener("start", this.#onBroadcastStart);
        this.#broadcastStream?.removeEventListener("stop", this.#onBroadcastStop);
        await this.#device.destroy();
        await Promise.all(Array.from(this.#recvStreams.values()).map(async (s) => this.#removeStream(s.getId())));
        await this.#recvTransport.destroy();
        await this.#sendTransport?.destroy();
        await this.#ws.destroy();
        this.dispatchEvent(new PicnicEvent("destroy", null));
    }
    getBroadcastStream() {
        return this.#broadcastStream;
    }
    getStreams() {
        return this.#recvStreams;
    }
    #updateStreams;
    async load() {
        await this.#ws.load();
        await this.#device.loadDevice();
        await this.#recvTransport.load();
        this.#ws.addEventListener("stream:add", 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async ({ data }) => {
            await this.#addStream(data);
        });
        this.#ws.addEventListener("stream:remove", 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async ({ data }) => {
            await this.#removeStream(data);
        });
        await this.#updateStreams();
    }
    #addStream;
    #removeStream;
    #onBroadcastStart;
    #onBroadcastStop;
    async broadcast() {
        if (this.#sendTransport === null) {
            this.#sendTransport = new PicnicTransport(this.#ws, this.#device, "send");
            this.#sendTransport.addEventListener("state:change", this.#onStateChange);
            await this.#sendTransport.load();
        }
        const broadcastStream = new SendStream(this.#sendTransport, this.#ws);
        broadcastStream.addEventListener("start", this.#onBroadcastStart);
        broadcastStream.addEventListener("stop", this.#onBroadcastStop);
        await broadcastStream.load();
        this.#broadcastStream = broadcastStream;
        return broadcastStream;
    }
}
//# sourceMappingURL=sdk.js.map