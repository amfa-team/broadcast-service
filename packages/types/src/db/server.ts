import { JsonDecoder } from "ts.data.json";
import type { TransportTopology } from "../topology";

export interface ServerKey {
  ip: string;
  port: number;
}

export interface Server extends ServerKey {
  token: string;
  transports: TransportTopology[];
}

export const createServerDecoder = JsonDecoder.object<Server>(
  {
    ip: JsonDecoder.string,
    token: JsonDecoder.string,
    port: JsonDecoder.number,
    transports: JsonDecoder.array(JsonDecoder.succeed, "transports"),
  },
  "CreateServer",
);
