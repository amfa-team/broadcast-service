import { captureException } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import PicnicError from "../../exceptions/PicnicError";
import { PicnicEvent } from "../events/event";
const videoConstraints = {
    audio: true,
    video: {
        width: { ideal: 960 },
        height: { ideal: 540 },
        frameRate: { max: 24 },
    },
};
const screenConstraints = {
    audio: true,
    video: {
        cursor: "motion",
        logicalSurface: true,
        displaySurface: "monitor",
        width: { max: 1280 },
        height: { max: 720 },
        frameRate: { max: 24 },
    },
};
const audioKind = "audio";
const videoKind = "video";
async function createVideoProducer(mediaStream, transport) {
    const tracks = mediaStream.getVideoTracks();
    if (tracks.length === 0) {
        // TODO: Handle this case, as it will cause the RecvStream to never being ready
        return null;
    }
    const track = tracks[0];
    const producer = await transport.produce({
        track,
        codecOptions: {
            videoGoogleStartBitrate: 1000,
            videoGoogleMaxBitrate: 6000000,
        },
        disableTrackOnPause: true,
        zeroRtpOnPause: true,
        encodings: [
            {
                rid: "r0",
                dtx: true,
                maxBitrate: 100000,
                scaleResolutionDownBy: 4,
                scalabilityMode: "S1T3",
            },
            {
                rid: "r1",
                dtx: true,
                maxBitrate: 300000,
                scaleResolutionDownBy: 2,
                scalabilityMode: "S1T3",
            },
            {
                rid: "r2",
                dtx: true,
                scaleResolutionDownBy: 720 / 540,
                maxBitrate: 700000,
                scalabilityMode: "S1T3",
            },
        ],
    });
    // await producer.setMaxSpatialLayer(1);
    console.log(producer);
    return producer;
}
async function createAudioProducer(mediaStream, transport) {
    const tracks = mediaStream.getAudioTracks();
    if (tracks.length === 0) {
        // TODO: Handle this case, as it will cause the RecvStream to never being ready
        return null;
    }
    const track = tracks[0];
    return transport.produce({
        track,
        disableTrackOnPause: true,
        zeroRtpOnPause: true,
    });
}
async function resumeProducer(ws, transport, producer) {
    await ws.send("/sfu/send/state", {
        state: "play",
        transportId: transport.getId(),
        producerId: producer.id,
    });
    producer.resume();
}
async function pauseProducer(ws, transport, producer) {
    await ws.send("/sfu/send/state", {
        state: "pause",
        transportId: transport.getId(),
        producerId: producer.id,
    });
    producer.pause();
}
export default class SendStream extends EventTarget {
    constructor(transport, ws) {
        super();
        this.#active = false;
        this.#userMedia = null;
        this.#isScreenSharing = false;
        this.#videoProducer = null;
        this.#audioProducer = null;
        this.#destroyAudioProducer = async () => {
            if (this.#audioProducer !== null) {
                await this.#ws
                    .send("/sfu/send/state", {
                    producerId: this.#audioProducer.id,
                    transportId: this.#transport.getId(),
                    state: "close",
                })
                    .catch(captureException);
                this.#audioProducer.close();
            }
        };
        this.#destroyVideoProducer = async () => {
            if (this.#videoProducer !== null) {
                await this.#ws
                    .send("/sfu/send/state", {
                    producerId: this.#videoProducer.id,
                    transportId: this.#transport.getId(),
                    state: "close",
                })
                    .catch(captureException);
                this.#videoProducer.close();
            }
        };
        this.#transport = transport;
        this.#ws = ws;
    }
    #transport;
    #ws;
    #active;
    #userMedia;
    #isScreenSharing;
    #videoProducer;
    #audioProducer;
    getId() {
        return this.#transport.getId();
    }
    #destroyAudioProducer;
    #destroyVideoProducer;
    async destroy() {
        this.#active = false;
        await Promise.all([
            this.#destroyAudioProducer(),
            this.#destroyVideoProducer(),
        ]);
        if (this.#userMedia) {
            this.#userMedia.getTracks().forEach((track) => {
                track.stop();
            });
            this.#userMedia = null;
        }
        this.dispatchEvent(new PicnicEvent("stop", null));
    }
    isActive() {
        return this.#active;
    }
    async load() {
        this.#userMedia = await navigator.mediaDevices.getUserMedia(videoConstraints);
        [this.#videoProducer, this.#audioProducer] = await Promise.all([
            createVideoProducer(this.#userMedia, this.#transport),
            createAudioProducer(this.#userMedia, this.#transport),
        ]);
        this.dispatchEvent(new PicnicEvent("start", null));
        this.#active = true;
    }
    async screenShare() {
        this.#userMedia = await navigator.mediaDevices.getDisplayMedia(screenConstraints);
        const videoTracks = this.#userMedia.getVideoTracks();
        const audioTracks = this.#userMedia.getAudioTracks();
        if (videoTracks.length > 0) {
            const videoTrack = videoTracks[0];
            await this.#videoProducer?.replaceTrack({ track: videoTrack });
            // await this.#videoProducer?.setMaxSpatialLayer(2);
            videoTrack.addEventListener("ended", () => {
                this.disableShare().catch((e) => {
                    console.error(e);
                });
            });
        }
        if (audioTracks.length > 0) {
            await this.#audioProducer?.replaceTrack({ track: audioTracks[0] });
        }
        this.#isScreenSharing = true;
        this.dispatchEvent(new PicnicEvent("media:change", null));
    }
    async disableShare() {
        this.#userMedia = await navigator.mediaDevices.getUserMedia(videoConstraints);
        const videoTrack = this.#userMedia?.getVideoTracks()[0] ?? null;
        const audioTrack = this.#userMedia?.getAudioTracks()[0] ?? null;
        if (videoTrack !== null) {
            await this.#videoProducer?.replaceTrack({ track: videoTrack });
            // await this.#videoProducer?.setMaxSpatialLayer(1);
        }
        if (audioTrack !== null) {
            await this.#audioProducer?.replaceTrack({ track: audioTrack });
        }
        this.#isScreenSharing = false;
        this.dispatchEvent(new PicnicEvent("media:change", null));
    }
    isScreenShareEnabled() {
        return this.#isScreenSharing;
    }
    async pauseAudio() {
        if (this.#audioProducer !== null) {
            await pauseProducer(this.#ws, this.#transport, this.#audioProducer);
        }
        const evt = new PicnicEvent("stream:pause", { kind: audioKind });
        this.dispatchEvent(evt);
    }
    async resumeAudio() {
        if (this.#audioProducer !== null) {
            await resumeProducer(this.#ws, this.#transport, this.#audioProducer);
        }
        this.dispatchEvent(new PicnicEvent("stream:resume", { kind: audioKind }));
    }
    isAudioPaused() {
        return this.#audioProducer?.paused ?? true;
    }
    async pauseVideo() {
        if (this.#videoProducer !== null) {
            await pauseProducer(this.#ws, this.#transport, this.#videoProducer);
        }
        this.dispatchEvent(new PicnicEvent("stream:pause", { kind: videoKind }));
    }
    async resumeVideo() {
        if (this.#videoProducer !== null) {
            await resumeProducer(this.#ws, this.#transport, this.#videoProducer);
        }
        this.dispatchEvent(new PicnicEvent("stream:resume", { kind: videoKind }));
    }
    isVideoPaused() {
        return this.#videoProducer?.paused ?? true;
    }
    getUserMediaStream() {
        if (this.#userMedia === null) {
            throw new PicnicError("SendStream.getUserMediaStream: is not loaded", null);
        }
        return this.#userMedia;
    }
}
//# sourceMappingURL=SendStream.js.map