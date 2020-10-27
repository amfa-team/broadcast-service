import type { ProducerState, Routes } from "@amfa-team/types";
import { JsonDecoder } from "ts.data.json";
declare type CreateStreamEvent = {
    connectionId: string;
    data: Routes["/send/create"]["in"];
};
export declare const decodeSendParams: JsonDecoder.Decoder<Routes["/send/create"]["in"]>;
export declare function onCreateStream(event: CreateStreamEvent): Promise<string>;
declare type OnChangeStreamStateEventData = {
    transportId: string;
    producerId: string;
    state: "close" | "pause" | "play";
};
declare type OnChangeStreamStateEvent = {
    connectionId: string;
    data: OnChangeStreamStateEventData;
};
export declare const decodeOnChangeStreamStateData: JsonDecoder.Decoder<OnChangeStreamStateEventData>;
export declare function onChangeStreamState(event: OnChangeStreamStateEvent): Promise<null>;
interface CloseStreamParams {
    transportId: string;
    producerId: null;
    destroy: false;
}
export declare function closeStream(params: CloseStreamParams): Promise<void>;
interface ProducerStateChangeEvent {
    transportId: string;
    producerId: string;
    state: ProducerState;
}
export declare function onProducerStateChange(event: ProducerStateChangeEvent): Promise<boolean>;
export {};
//# sourceMappingURL=streamService.d.ts.map