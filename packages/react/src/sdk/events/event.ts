import type {
  StreamConsumerInfo,
  StreamInfo,
} from "@amfa-team/broadcast-service-types";
import { Event as EventShim } from "event-target-shim";

export class PicnicEvent<T extends string, D> extends EventShim<T> {
  data: D;

  constructor(type: T, data: D) {
    super(type);
    this.data = data;
  }
}

export type ServerEvents = {
  "stream:add": PicnicEvent<"stream:add", StreamInfo>;
  "stream:remove": PicnicEvent<"stream:remove", string>;
  "media:change": PicnicEvent<"media:change", null>;
  "stream:pause": PicnicEvent<"stream:pause", { kind: "audio" | "video" }>;
  "stream:resume": PicnicEvent<"stream:resume", { kind: "audio" | "video" }>;
  "stream:state": PicnicEvent<"stream:state", StreamInfo>;
  "streamConsumer:state": PicnicEvent<
    "streamConsumer:state",
    StreamConsumerInfo
  >;
};
