import type { Connection, ConnectionKey, CreateConnection, PatchConnection } from "@amfa-team/types";
export declare function createConnection(data: CreateConnection): Promise<Connection>;
export declare function deleteConnection({ connectionId, }: ConnectionKey): Promise<void>;
export declare function getConnection({ connectionId, }: ConnectionKey): Promise<Connection | null>;
export declare function getConnectionsByToken({ token, }: Pick<Connection, "token">): Promise<Connection[]>;
export declare function getAllConnections(): Promise<Connection[]>;
export declare function patchConnection(params: PatchConnection): Promise<Connection>;
export declare function findConnectionByRecvTransportId(recvTransportId: string): Promise<Connection[]>;
//# sourceMappingURL=connectionRepository.d.ts.map