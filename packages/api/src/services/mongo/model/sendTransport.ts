import type { SendTransport } from "@amfa-team/broadcast-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";

interface ISendTransportDocument extends SendTransport, Document {
  _id: string;
  id: string;
}

const SendTransportSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    audioTrack: {
      type: String,
      required: false,
    },
    videoTrack: {
      type: String,
      required: false,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

export type { ISendTransportDocument };
export { SendTransportSchema };
