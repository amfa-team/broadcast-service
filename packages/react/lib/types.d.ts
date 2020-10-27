import type { types } from "mediasoup-client";
declare type RecvResource = {
    audio: null | types.Consumer;
    video: null | types.Consumer;
    screen: null | types.Consumer;
};
export declare type SFUState = {
    device: types.Device;
    send: {
        transport: types.Transport | null;
        audio: null | types.Producer;
        video: null | types.Producer;
        screen: null | types.Producer;
    };
    receive: {
        transport: types.Transport | null;
        resources: {
            [producerId: string]: RecvResource;
        };
    };
};
export declare type Settings = {
    endpoint: string;
    token: string;
};
export declare type WebSocketState = "initial" | "connecting" | "connected" | "closed" | "disconnected";
export declare type DeviceState = "initial" | "loading" | "ready" | "error";
export declare type TransportState = "initial" | "creating" | "connecting" | "connected" | "disconnected" | "error";
export declare type SDKState = {
    websocket: WebSocketState;
    device: DeviceState;
    recvTransport: TransportState;
    sendTransport: TransportState;
};
export {};
//# sourceMappingURL=types.d.ts.map