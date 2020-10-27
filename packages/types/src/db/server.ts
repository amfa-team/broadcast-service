import { JsonDecoder } from "ts.data.json";

export interface ServerKey {
  ip: string;
  port: number;
}

export interface Server extends ServerKey {
  token: string;
}

export const createServerDecoder = JsonDecoder.object<Server>(
  {
    ip: JsonDecoder.string,
    token: JsonDecoder.string,
    port: JsonDecoder.number,
  },
  "CreateServer",
);
