import { JsonDecoder } from "ts.data.json";

export interface Server {
  ip: string;
  token: string;
  port: number;
}

export const createServerDecoder = JsonDecoder.object<Server>(
  {
    ip: JsonDecoder.string,
    token: JsonDecoder.string,
    port: JsonDecoder.number,
  },
  "CreateServer"
);
