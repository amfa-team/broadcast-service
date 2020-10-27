import type { ConsumerInfo, ConsumerState, Routes } from "@amfa-team/types";
import { JsonDecoder } from "ts.data.json";
declare type CreateStreamConsumerEvent = {
    connectionId: string;
    data: Routes["/receive/create"]["in"];
};
export declare const decodeRecvParams: JsonDecoder.Decoder<Routes["/receive/create"]["in"]>;
export declare function onCreateStreamConsumer(event: CreateStreamConsumerEvent): Promise<ConsumerInfo>;
declare type ChangeStreamConsumerStateEventData = {
    state: "pause" | "play";
    transportId: string;
    consumerId: string;
};
declare type ChangeStreamConsumerStateEvent = {
    data: ChangeStreamConsumerStateEventData;
};
export declare const decodeChangeStreamConsumerStateData: JsonDecoder.Decoder<ChangeStreamConsumerStateEventData>;
export declare function onChangeStreamConsumerState(event: ChangeStreamConsumerStateEvent): Promise<null>;
interface CloseConsumerParams {
    transportId: string;
    consumerId: string | null;
    destroy: false;
}
export declare function closeConsumer(params: CloseConsumerParams): Promise<void>;
interface CloseConsumerOfParams {
    sourceTransportId: string;
    destroy: false;
}
export declare function closeConsumerOf(params: CloseConsumerOfParams): Promise<void>;
interface ConsumerStateChangeEvent {
    transportId: string;
    consumerId: string;
    state: ConsumerState;
}
export declare function onConsumerStateChange(event: ConsumerStateChangeEvent): Promise<boolean>;
interface GetConsumerStateParams {
    consumerId: string;
    transportId: string;
}
export declare function getStreamConsumerState(params: GetConsumerStateParams): Promise<ConsumerState>;
export {};
//# sourceMappingURL=streamConsumerService.d.ts.map