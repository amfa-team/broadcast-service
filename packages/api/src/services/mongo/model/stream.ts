import type { StreamInfo } from "@amfa-team/broadcast-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";

interface IStreamDocument extends StreamInfo, Document {
  _id: string;
  id: string;
}

const StreamSchema: Schema = new Schema(
  {
    transportId: {
      type: String,
      required: true,
    },
    producerId: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      required: true,
      enum: ["audio", "video"],
    },
    score: {
      type: Number,
      required: true,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);
StreamSchema.index(
  {
    transportId: 1,
    producerId: 1,
  },
  {
    unique: true,
  },
);

export type { IStreamDocument };
export { StreamSchema };
