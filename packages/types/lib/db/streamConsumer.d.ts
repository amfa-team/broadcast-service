export interface StreamConsumerKey {
    transportId: string;
    consumerId: string;
}
export interface StreamConsumerInfo extends StreamConsumerKey {
    sourceTransportId: string;
    producerId: string;
    score: number;
    producerScore: number;
    paused: boolean;
    producerPaused: boolean;
}
export interface PatchStreamConsumer extends Partial<StreamConsumerInfo> {
    transportId: string;
    consumerId: string;
}
//# sourceMappingURL=streamConsumer.d.ts.map