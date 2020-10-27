import type { Settings } from "../types";
export declare function get<T>(settings: Settings, path: string): Promise<T>;
export declare function post<T>(settings: Settings, path: string, data: Record<string, unknown>): Promise<T>;
//# sourceMappingURL=request.d.ts.map