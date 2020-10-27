import type { PatchSendTransport, SendTransport, SendTransportKey } from "@amfa-team/types";
export declare function createSendTransport(transport: SendTransportKey): Promise<void>;
export declare function deleteSendTransport({ transportId, }: SendTransportKey): Promise<void>;
export declare function getSendTransport({ transportId, }: SendTransportKey): Promise<SendTransport | null>;
export declare function patchSendTransport(params: PatchSendTransport): Promise<SendTransport>;
export declare function getAllSendTransport(): Promise<SendTransport[]>;
//# sourceMappingURL=sendTransportRepository.d.ts.map