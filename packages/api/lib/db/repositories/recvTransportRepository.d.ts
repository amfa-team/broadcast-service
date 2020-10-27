import type { RecvTransport, RecvTransportKey } from "@amfa-team/types";
export declare function createRecvTransport(transport: RecvTransport): Promise<void>;
export declare function deleteRecvTransport({ transportId, }: RecvTransportKey): Promise<void>;
export declare function getRecvTransport({ transportId, }: RecvTransportKey): Promise<RecvTransport | null>;
export declare function getAllRecvTransport(): Promise<RecvTransport[]>;
//# sourceMappingURL=recvTransportRepository.d.ts.map