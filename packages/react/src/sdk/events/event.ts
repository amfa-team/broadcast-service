import type { StreamConsumerInfo, StreamInfo } from "@amfa-team/types";

export class PicnicEvent<T> extends Event {
  data: T;

  constructor(type: string, data: T) {
    super(type);
    this.data = data;
  }
}

export type ServerEvents = {
  "stream:add": PicnicEvent<StreamInfo>;
  "stream:remove": PicnicEvent<string>;
  "media:change": PicnicEvent<null>;
  "stream:pause": PicnicEvent<{ kind: "audio" | "video" }>;
  "stream:resume": PicnicEvent<{ kind: "audio" | "video" }>;
  "stream:state": PicnicEvent<StreamInfo>;
  "streamConsumer:state": PicnicEvent<StreamConsumerInfo>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type Empty = {};
