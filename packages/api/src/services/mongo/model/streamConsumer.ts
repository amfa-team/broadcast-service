import type { StreamConsumerInfo } from "@amfa-team/broadcast-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";

interface IStreamConsumerDocument extends StreamConsumerInfo, Document {
  _id: string;
  id: string;
}

const StreamConsumerSchema: Schema = new Schema(
  {
    transportId: {
      type: String,
      required: true,
    },
    consumerId: {
      type: String,
      required: true,
    },
    sourceTransportId: {
      type: String,
      required: true,
      index: true,
    },
    producerId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    producerScore: {
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
StreamConsumerSchema.index(
  {
    transportId: 1,
    consumerId: 1,
  },
  {
    unique: true,
  },
);

export type { IStreamConsumerDocument };
export { StreamConsumerSchema };
