import { Schema, aws, model } from "dynamoose";
import type { Document } from "dynamoose/dist/Document";
import type { Connection } from "../../../types/src/db/connection";
import type { Participant } from "../../../types/src/db/participant";
import { Role } from "../../../types/src/db/participant";
import type { RecvTransport } from "../../../types/src/db/recvTransport";
import type { SendTransport } from "../../../types/src/db/sendTransport";
import type { Server } from "../../../types/src/db/server";
import type { StreamInfo } from "../../../types/src/db/stream";
import type { StreamConsumerInfo } from "../../../types/src/db/streamConsumer";

// Depends on serverless-offline plugin which adds IS_OFFLINE to process.env when running offline
if (process.env.IS_OFFLINE) {
  aws.ddb.local("http://localhost:9005");
}

const INDEX_SOURCE_TRANSPORT =
  process.env.STREAM_CONSUMER_TABLE_INDEX_SOURCE_TRANSPORT ?? "";

export type ServerDocument = Server & Document;

export const serverSchema = new Schema({
  ip: {
    type: String,
    required: true,
    hashKey: true,
  },
  port: {
    type: Number,
    required: true,
    rangeKey: true,
  },
  token: {
    type: String,
    required: true,
  },
});

export const ServerModel = model<ServerDocument>(
  process.env.SERVER_TABLE ?? "",
  serverSchema,
);

export type ParticipantDocument = Participant & Document;

export const participantSchema = new Schema({
  token: {
    type: String,
    required: true,
    hashKey: true,
  },
  role: {
    type: String,
    required: true,
    enum: [Role.host, Role.guest],
  },
});

export const ParticipantModel = model<ParticipantDocument>(
  process.env.PARTICIPANT_TABLE ?? "",
  participantSchema,
);

export type ConnectionDocument = Connection & Document;

export const connectionSchema = new Schema({
  connectionId: {
    type: String,
    required: true,
    hashKey: true,
  },
  token: {
    type: String,
    required: true,
  },
  sendTransportId: {
    type: String,
    required: false,
  },
  recvTransportId: {
    type: String,
    required: false,
  },
});

export const ConnectionModel = model<ConnectionDocument>(
  process.env.CONNECTION_TABLE ?? "",
  connectionSchema,
);

export type RecvTransportDocument = RecvTransport & Document;

export const recvTransportSchema = new Schema({
  transportId: {
    type: String,
    required: true,
    hashKey: true,
  },
});

export const RecvTransportModel = model<RecvTransportDocument>(
  process.env.RECV_TRANSPORT_TABLE ?? "",
  recvTransportSchema,
);

export type SendTransportDocument = SendTransport & Document;

export const sendTransportSchema = new Schema({
  transportId: {
    type: String,
    required: true,
    hashKey: true,
  },
  audioTrack: {
    type: String,
    required: false,
  },
  videoTrack: {
    type: String,
    required: false,
  },
});

export const SendTransportModel = model<SendTransportDocument>(
  process.env.SEND_TRANSPORT_TABLE ?? "",
  sendTransportSchema,
);

export type StreamDocument = StreamInfo & Document;

export const streamSchema = new Schema({
  transportId: {
    type: String,
    required: true,
    hashKey: true,
  },
  producerId: {
    type: String,
    required: true,
    rangeKey: true,
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
});

export const StreamModel = model<StreamDocument>(
  process.env.STREAM_TABLE ?? "",
  streamSchema,
);

export type StreamConsumerDocument = StreamConsumerInfo & Document;

export const streamConsumerSchema = new Schema({
  transportId: {
    type: String,
    required: true,
    hashKey: true,
  },
  consumerId: {
    type: String,
    required: true,
    rangeKey: true,
  },
  sourceTransportId: {
    type: String,
    required: true,
    index: {
      name: INDEX_SOURCE_TRANSPORT,
      global: true,
      project: true,
    },
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
});

export const StreamConsumerModel = model<StreamConsumerDocument>(
  process.env.STREAM_CONSUMER_TABLE ?? "",
  streamConsumerSchema,
);
