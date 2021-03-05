import type { Server } from "@amfa-team/broadcast-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";

interface IServerDocument extends Server, Document {
  _id: string;
  id: string;
}

const ServerSchema: Schema = new Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
    token: {
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
ServerSchema.index(
  {
    ip: 1,
    port: 1,
  },
  {
    unique: true,
  },
);

export type { IServerDocument };
export { ServerSchema };
