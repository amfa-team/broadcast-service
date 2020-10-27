import { JsonDecoder } from "ts.data.json";
export const createServerDecoder = JsonDecoder.object({
    ip: JsonDecoder.string,
    token: JsonDecoder.string,
    port: JsonDecoder.number,
}, "CreateServer");
//# sourceMappingURL=server.js.map