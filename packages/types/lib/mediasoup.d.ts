import type { types } from "mediasoup";
export declare type InitConnectionParams = {
    type: "send" | "recv";
    sctpCapabilities: types.SctpCapabilities;
};
export declare type ConnectionInfo = {
    transportId: string;
    iceParameters: types.IceParameters;
    iceCandidates: types.IceCandidate[];
    dtlsParameters: types.DtlsParameters;
    sctpParameters: types.SctpParameters | undefined;
};
export declare type ConnectParams = {
    transportId: string;
    dtlsParameters: types.DtlsParameters;
};
export interface DestroyConnectionParams {
    transportId: string;
    delay: number;
}
export declare type SendParams = {
    transportId: string;
    kind: types.MediaKind;
    rtpParameters: types.RtpParameters;
};
export declare type SendDestroyParams = {
    transportId: string;
    producerId: string;
    delay: number;
};
export declare type ReceiveParams = {
    transportId: string;
    sourceTransportId: string;
    producerId: string;
    rtpCapabilities: types.RtpCapabilities;
};
export declare type ReceiveDestroyParams = {
    transportId: string;
    consumerId: string;
    delay: number;
};
export declare type ConsumerInfo = {
    consumerId: string;
    producerId: string;
    kind: types.MediaKind;
    rtpParameters: types.RtpParameters;
};
export declare type ConsumerState = {
    score: number;
    producerScore: number;
    paused: boolean;
    producerPaused: boolean;
};
export declare type ProducerState = {
    score: number;
    paused: boolean;
};
//# sourceMappingURL=mediasoup.d.ts.map