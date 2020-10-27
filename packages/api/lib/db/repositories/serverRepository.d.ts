import type { Server, ServerKey } from "@amfa-team/types";
export declare function createServer(server: Server): Promise<Server>;
export declare function getServer({ ip, port, }: ServerKey): Promise<Server | null>;
export declare function getAllServers(): Promise<Server[]>;
//# sourceMappingURL=serverRepository.d.ts.map