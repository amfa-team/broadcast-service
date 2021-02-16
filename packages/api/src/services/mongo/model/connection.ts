import type { Connection } from "@amfa-team/broadcast-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";

interface IConnectionDocument extends Connection, Document {
  _id: string;
  id: string;
}

const ConnectionSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    sendTransportId: {
      type: String,
      required: false,
    },
    recvTransportId: {
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

export type { IConnectionDocument };
export { ConnectionSchema };
