import type { Routes } from "@amfa-team/types";
interface ConnectEvent {
    connectionId: string;
    token: string;
}
export declare function onConnect(event: ConnectEvent): Promise<Routes["/router-capabilities"]["out"]>;
interface RefreshConnectionEvent {
    connectionId: string;
    token: string;
}
export declare function onRefreshConnection(event: RefreshConnectionEvent): Promise<boolean>;
export declare function onPing(): string;
interface DisconnectEvent {
    connectionId: string;
}
export declare function onDisconnect(event: DisconnectEvent): Promise<void>;
export {};
//# sourceMappingURL=connectionService.d.ts.map