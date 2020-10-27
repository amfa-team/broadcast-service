import type { PatchStreamConsumer, StreamConsumerInfo } from "@amfa-team/types";
export declare function createStreamConsumer(stream: StreamConsumerInfo): Promise<StreamConsumerInfo>;
export declare function getAllStreamConsumers(): Promise<StreamConsumerInfo[]>;
export declare function findStreamConsumerByTransportId(transportId: string): Promise<StreamConsumerInfo[]>;
export declare function findStreamConsumerBySourceTransportId(sourceTransportId: string): Promise<StreamConsumerInfo[]>;
export declare function getStreamConsumer(transportId: string, consumerId: string): Promise<StreamConsumerInfo | null>;
export declare function deleteStreamConsumer(transportId: string, consumerId: string): Promise<void>;
export declare function deleteStreamConsumerByTransportId(transportId: string): Promise<void>;
export declare function deleteStreamConsumerBySoourceTransportId(sourceTransportId: string): Promise<void>;
export declare function patchStreamConsumer(params: PatchStreamConsumer): Promise<StreamConsumerInfo>;
//# sourceMappingURL=streamConsumerRepository.d.ts.map