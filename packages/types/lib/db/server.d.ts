import { JsonDecoder } from "ts.data.json";
export interface ServerKey {
    ip: string;
    port: number;
}
export interface Server extends ServerKey {
    token: string;
}
export declare const createServerDecoder: JsonDecoder.Decoder<Server>;
//# sourceMappingURL=server.d.ts.map