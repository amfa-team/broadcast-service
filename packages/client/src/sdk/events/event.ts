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
  "media:change": PicnicEvent<null>;
  "stream:pause": PicnicEvent<{ kind: "audio" | "video" }>;
  "stream:resume": PicnicEvent<{ kind: "audio" | "video" }>;
  "stream:quality": PicnicEvent<StreamInfo>;
};

export type RecvStreamEventMap = {
  quality: PicnicEvent<{ kind: "audio" | "video"; score: number }>;
};
