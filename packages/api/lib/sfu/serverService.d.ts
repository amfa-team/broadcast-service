import type { Routes } from "@amfa-team/types";
import type { RequestInit } from "node-fetch";
export declare function requestServer<P extends keyof Routes>(path: string, options?: RequestInit | null): Promise<Routes[P]["out"]>;
export declare function postToServer<P extends keyof Routes>(path: P, data: Routes[P]["in"]): Promise<Routes[P]["out"]>;
//# sourceMappingURL=serverService.d.ts.map