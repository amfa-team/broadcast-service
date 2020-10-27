import type { ConnectionInfo, Routes } from "@amfa-team/types";
interface InitRecvTransportEvent {
    connectionId: string;
    data: Routes["/connect/init"]["in"];
}
export declare function onInitRecvTransport(event: InitRecvTransportEvent): Promise<ConnectionInfo>;
interface ConnectRecvTransportEvent {
    connectionId: string;
    data: Routes["/connect/create"]["in"];
}
export declare function onConnectRecvTransport(event: ConnectRecvTransportEvent): Promise<Routes["/connect/create"]["out"]>;
interface OnRecvTransportCloseEvent {
    connectionId: string;
    transportId: string;
}
interface CloseRecvTransportParams {
    connectionId: string;
    transportId: string | null;
    skipConnectionPatch: boolean;
}
export declare function closeRecvTransport(params: CloseRecvTransportParams): Promise<void>;
export declare function onRecvTransportClose(event: OnRecvTransportCloseEvent): Promise<void>;
export {};
//# sourceMappingURL=recvTransportService.d.ts.map