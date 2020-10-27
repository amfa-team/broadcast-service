import type { ConnectionInfo, Routes } from "@amfa-team/types";
interface InitSendTransportEvent {
    connectionId: string;
    data: Routes["/connect/init"]["in"];
}
export declare function onInitSendTransport(event: InitSendTransportEvent): Promise<ConnectionInfo>;
interface ConnectSendTransportEvent {
    connectionId: string;
    data: Routes["/connect/create"]["in"];
}
export declare function onConnectSendTransport(event: ConnectSendTransportEvent): Promise<Routes["/connect/create"]["out"]>;
interface CloseSendTransportParams {
    connectionId: string;
    transportId: string | null;
    skipConnectionPatch: boolean;
}
export declare function closeSendTransport(params: CloseSendTransportParams): Promise<void>;
interface OnSendTransportCloseEvent {
    connectionId: string;
    transportId: string;
}
export declare function onSendTransportClose(event: OnSendTransportCloseEvent): Promise<void>;
export {};
//# sourceMappingURL=sendTransportService.d.ts.map