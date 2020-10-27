import type { types } from "mediasoup";
export declare type ConsumerTopology = {
    id: string;
    kind: types.MediaKind;
    producerId: string;
    state: {
        paused: boolean;
        closed: boolean;
        type: types.ConsumerType;
        producerPaused: boolean;
        currentLayers: types.ConsumerLayers | undefined;
    };
};
export declare type ProducerTopology = {
    id: string;
    kind: types.MediaKind;
    consumers: ConsumerTopology[];
    state: {
        paused: boolean;
        closed: boolean;
    };
    stats: types.ProducerStat[];
};
export declare type TransportTopology = {
    id: string;
    producers: ProducerTopology[];
    consumers: ConsumerTopology[];
};
export declare type RouterTopology = {
    id: string;
    transports: TransportTopology[];
};
export declare type WorkerTopology = {
    pid: number;
    router: RouterTopology;
};
export declare type ServerTopology = {
    workers: WorkerTopology[];
};
//# sourceMappingURL=topology.d.ts.map