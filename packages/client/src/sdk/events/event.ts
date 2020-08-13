import { StreamInfo } from "../../../../types";

export class PicnicEvent<T> extends Event {
  data: T;

  constructor(type: string, data: T) {
    super(type);
    this.data = data;
  }
}

export type ServerEventMap = {
  "stream:add": PicnicEvent<StreamInfo>;
  "stream:remove": PicnicEvent<string>;
  "stream:pause": PicnicEvent<{ kind: "audio" | "video" }>;
  "stream:resume": PicnicEvent<{ kind: "audio" | "video" }>;
};
