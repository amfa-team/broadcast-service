import type { RecvTransport } from "@amfa-team/broadcast-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";

interface IRecvTransportDocument extends RecvTransport, Document {
  _id: string;
  id: string;
}

const RecvTransportSchema: Schema = new Schema(
  {
    _id: {
      type: String,
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

export type { IRecvTransportDocument };
export { RecvTransportSchema };
