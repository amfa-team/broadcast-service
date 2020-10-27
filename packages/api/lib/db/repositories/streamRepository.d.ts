import type { PatchStream, StreamInfo } from "@amfa-team/types";
export declare function createStream(stream: StreamInfo): Promise<StreamInfo>;
export declare function deleteStream(transportId: string, producerId: string): Promise<void>;
export declare function getStream(transportId: string, producerId: string): Promise<StreamInfo | null>;
export declare function findStreamByTransportId(transportId: string): Promise<StreamInfo[]>;
export declare function deleteStreamByTransportId(transportId: string): Promise<void>;
export declare function getAllStreams(): Promise<StreamInfo[]>;
export declare function patchStream(params: PatchStream): Promise<StreamInfo>;
//# sourceMappingURL=streamRepository.d.ts.map