import { Connection } from "./types/connection";
import { Schema, model, aws } from "dynamoose";
import type { Document } from "dynamoose/dist/Document";
import { Role, Participant } from "./types/participant";
import { RecvTransport } from "./types/recvTransport";
import { SendTransport } from "./types/sendTransport";
import { Server } from "./types/server";
import { StreamInfo } from "./types/stream";
import { StreamConsumerInfo } from "./types/streamConsumer";

// Depends on serverless-offline plugin which adds IS_OFFLINE to process.env when running offline
if (process.env.IS_OFFLINE) {
  aws.ddb.local("http://localhost:9005");
}

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

export const serverModel = model<ServerDocument>(
  process.env.SERVER_TABLE ?? "",
  serverSchema
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

export const participantModel = model<ParticipantDocument>(
  process.env.PARTICIPANT_TABLE ?? "",
  participantSchema
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

export const connectionModel = model<ConnectionDocument>(
  process.env.CONNECTION_TABLE ?? "",
  connectionSchema
);

export type RecvTransportDocument = RecvTransport & Document;

export const recvTransportSchema = new Schema({
  transportId: {
    type: String,
    required: true,
    hashKey: true,
  },
});

export const recvTransportModel = model<RecvTransportDocument>(
  process.env.RECV_TRANSPORT_TABLE ?? "",
  recvTransportSchema
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

export const sendTransportModel = model<SendTransportDocument>(
  process.env.SEND_TRANSPORT_TABLE ?? "",
  sendTransportSchema
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
});

export const streamModel = model<StreamDocument>(
  process.env.STREAM_TABLE ?? "",
  streamSchema
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
  },
  producerId: {
    type: String,
    required: true,
  },
});

export const streamConsumerModel = model<StreamConsumerDocument>(
  process.env.STREAM_CONSUMER_TABLE ?? "",
  streamConsumerSchema
);
