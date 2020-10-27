import { EventTarget } from "event-target-shim";
import { PicnicEvent } from "../events/event";
async function resumeConsumer(ws, transport, consumer) {
    await ws.send("/sfu/receive/state", {
        state: "play",
        transportId: transport.getId(),
        consumerId: consumer.id,
    });
    consumer.resume();
}
async function pauseConsumer(ws, transport, consumer) {
    await ws.send("/sfu/receive/state", {
        state: "pause",
        transportId: transport.getId(),
        consumerId: consumer.id,
    });
    consumer.pause();
}
async function createConsumer(ws, transport, device, sourceTransportId, producerId) {
    const req = {
        transportId: transport.getId(),
        rtpCapabilities: device.getRtpCapabilities(),
        sourceTransportId,
        producerId,
    };
    const info = await ws.send("/sfu/receive/create", req);
    const consumer = await transport.consume({
        id: info.consumerId,
        producerId: info.producerId,
        kind: info.kind,
        rtpParameters: info.rtpParameters,
    });
    const state = await ws.send("/sfu/receive/state/get", {
        consumerId: info.consumerId,
        transportId: transport.getId(),
    });
    return { consumer, state };
}
const audioKind = "audio";
const videoKind = "video";
export class RecvStream extends EventTarget {
    constructor(options) {
        super();
        this.#stream = new MediaStream();
        this.#audioConsumer = null;
        this.#videoConsumer = null;
        this.#audioState = {
            score: 0,
            producerScore: 0,
            paused: false,
            producerPaused: false,
        };
        this.#videoState = {
            score: 0,
            producerScore: 0,
            paused: false,
            producerPaused: false,
        };
        this.#onQualityChange = (event) => {
            const { score, consumerId, producerScore, paused, producerPaused, } = event.data;
            const state = { score, producerScore, paused, producerPaused };
            if (this.#audioConsumer?.id === consumerId) {
                this.#audioState = state;
                const evt = new PicnicEvent("state", { state, kind: audioKind });
                this.dispatchEvent(evt);
            }
            if (this.#videoConsumer?.id === consumerId) {
                this.#videoState = state;
                const evt = new PicnicEvent("state", { state, kind: videoKind });
                this.dispatchEvent(evt);
            }
        };
        this.#ws = options.ws;
        this.#transport = options.transport;
        this.#device = options.device;
        this.#sourceTransportId = options.sourceTransportId;
        this.#ws.addEventListener("streamConsumer:state", this.#onQualityChange);
        this.#createdAt = Date.now();
    }
    #ws;
    #stream;
    #transport;
    #device;
    #audioConsumer;
    #videoConsumer;
    #audioState;
    #videoState;
    #sourceTransportId;
    // Used to order streams by reception order to prevent flickering
    #createdAt;
    async destroy() {
        // TODO: notify API?
        // Not needed from stream:delete event because sourceTransport closed ==> consumer closed server-side
        this.#audioConsumer?.close();
        this.#videoConsumer?.close();
        this.#ws.removeEventListener("streamConsumer:state", this.#onQualityChange);
    }
    getCreatedAt() {
        return this.#createdAt;
    }
    #onQualityChange;
    getId() {
        return this.#sourceTransportId;
    }
    async load(producerId) {
        if (this.#videoConsumer?.producerId === producerId) {
            return;
        }
        if (this.#audioConsumer?.producerId === producerId) {
            return;
        }
        const { consumer, state } = await createConsumer(this.#ws, this.#transport, this.#device, this.#sourceTransportId, producerId);
        if (consumer.kind === "audio") {
            // TODO: If already exists (multiple audio per host)
            this.#audioConsumer = consumer;
            this.#audioState = state;
        }
        else {
            // TODO: If already exists (multiple video per host)
            this.#videoConsumer = consumer;
            this.#videoState = state;
        }
        this.#stream.addTrack(consumer.track);
    }
    isReady() {
        return this.#videoConsumer !== null && this.#audioConsumer !== null;
    }
    async pauseAudio() {
        if (this.#audioConsumer !== null) {
            await pauseConsumer(this.#ws, this.#transport, this.#audioConsumer);
            this.dispatchEvent(new PicnicEvent("stream:pause", { kind: audioKind }));
        }
    }
    async resumeAudio() {
        if (this.#audioConsumer !== null) {
            await resumeConsumer(this.#ws, this.#transport, this.#audioConsumer);
            this.dispatchEvent(new PicnicEvent("stream:resume", { kind: audioKind }));
        }
    }
    isAudioPaused() {
        return this.#audioConsumer?.paused ?? true;
    }
    getAudioState() {
        return this.#audioState;
    }
    async pauseVideo() {
        if (this.#videoConsumer !== null) {
            await pauseConsumer(this.#ws, this.#transport, this.#videoConsumer);
            this.dispatchEvent(new PicnicEvent("stream:pause", { kind: videoKind }));
        }
    }
    async resumeVideo() {
        if (this.#videoConsumer !== null) {
            await resumeConsumer(this.#ws, this.#transport, this.#videoConsumer);
            this.dispatchEvent(new PicnicEvent("stream:resume", { kind: videoKind }));
        }
    }
    isVideoPaused() {
        return this.#videoConsumer?.paused ?? true;
    }
    getVideoState() {
        return this.#videoState;
    }
    async resume() {
        await Promise.all([this.resumeAudio(), this.resumeVideo()]);
    }
    async pause() {
        await Promise.all([this.pauseAudio(), this.pauseVideo()]);
    }
    getMediaStream() {
        // TODO: if not load?
        return this.#stream;
    }
}
//# sourceMappingURL=RecvStream.js.map