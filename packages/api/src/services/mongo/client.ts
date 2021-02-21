import type { Context } from "aws-lambda";
import mongoose from "mongoose";
import type { Mongoose } from "mongoose";
import { getEnv, getEnvName } from "../../utils/env";
import { logger } from "../io/logger";
import type { IConnectionDocument } from "./model/connection";
import { ConnectionSchema } from "./model/connection";
import type { IRecvTransportDocument } from "./model/recvTransport";
import { RecvTransportSchema } from "./model/recvTransport";
import type { ISendTransportDocument } from "./model/sendTransport";
import { SendTransportSchema } from "./model/sendTransport";
import type { IServerDocument } from "./model/server";
import { ServerSchema } from "./model/server";
import type { IStreamDocument } from "./model/stream";
import { StreamSchema } from "./model/stream";
import type { IStreamConsumerDocument } from "./model/streamConsumer";
import { StreamConsumerSchema } from "./model/streamConsumer";

const cachedClientMap: Map<string, Promise<Mongoose>> = new Map();

function discardClient(url: string, client?: Mongoose) {
  cachedClientMap.delete(url);
  if (client) {
    setTimeout(() => {
      // Do not discard immediately to not fail currently running operations
      client.disconnect().catch((e) => {
        logger.error(e, "[mongo/client:discardClient]: disconnect failed");
      });
    }, 30_000);
  }
}

async function getClient(url: string): Promise<Mongoose> {
  logger.info("[mongo/client:getClient]: connecting to mongodb");

  let cachedClient = cachedClientMap.get(url) ?? null;
  if (cachedClient) {
    const client: Promise<Mongoose> = cachedClient
      .then((c) => {
        if (c.connection.readyState === 1) {
          return c;
        }
        discardClient(url, c);
        return getClient(url);
      })
      .catch(async (e) => {
        logger.error(e, "[mongo/client:connect]: cache failed");
        discardClient(url);
        return getClient(url);
      });
    logger.info("[mongo/client:getClient]: using cached mongodb client");
    return client;
  }

  try {
    const instance = new mongoose.Mongoose();
    cachedClient = instance.connect(url, {
      appname: `broadcast-service-${getEnvName()}`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10_000,
      poolSize: 2, // Maintain up to 2 socket connections
      maxPoolSize: Number(process.env.MAX_POOL_SIZE ?? 5),
      minPoolSize: Number(process.env.MIN_POOL_SIZE ?? 1),
      serverSelectionTimeoutMS: 5_000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 30_000, // Close sockets after 30 seconds of inactivity
      keepAlive: true,
      keepAliveInitialDelay: 30_000,
      useFindAndModify: false,
      useCreateIndex: true,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
      readPreference: "primaryPreferred",
    });

    cachedClientMap.set(url, cachedClient);

    const client: Mongoose = await cachedClient;
    // client.set("debug", true);

    logger.info("[mongo/client:connect]: connected to mongodb", {
      url,
    });

    client.connection.on("error", (err) => {
      logger.error(err, "[mongo/client:event]: error");
      cachedClientMap.delete(url);
      client.disconnect().catch((e) => logger.error(e));
    });

    client.connection.on("reconnectFailed", (err) => {
      logger.error(err, "[mongo/client:event]: reconnectFailed");
      cachedClientMap.delete(url);
      client.disconnect().catch((e) => logger.error(e));
    });

    client.connection.on("disconnected", () => {
      logger.warn("[mongo/client:event]: disconnected");
    });

    client.connection.on("connected", () => {
      logger.info("[mongo/client:event]: connected");
    });

    client.connection.on("reconnected", () => {
      logger.warn("[mongo/client:event]: reconnected");
    });

    client.connection.on("reconnectTries", () => {
      logger.warn("[mongo/client:event]: reconnectTries");
    });

    client.connection.on("close", () => {
      logger.warn("[mongo/client:event]: close");
      discardClient(url, client);
    });

    return client;
  } catch (e) {
    const message = "[mongo/client:connect]: unable to connect to mongodb";
    logger.error(e, message);
    throw new Error(message);
  }
}

export async function connect(context?: Context | null): Promise<Mongoose> {
  if (context) {
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false;
  }

  return getClient(getEnv("MONGO_DB_URL"));
}

export function close(context?: Context | null) {
  if (context) {
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = true;
  }
}

export async function getModels() {
  const client = await connect();

  return {
    ConnectionModel: client.model<IConnectionDocument>(
      "Connection",
      ConnectionSchema,
    ),
    RecvTransportModel: client.model<IRecvTransportDocument>(
      "RecvTransport",
      RecvTransportSchema,
    ),
    SendTransportModel: client.model<ISendTransportDocument>(
      "SendTransport",
      SendTransportSchema,
    ),
    StreamModel: client.model<IStreamDocument>("Stream", StreamSchema),
    StreamConsumerModel: client.model<IStreamConsumerDocument>(
      "StreamConsumer",
      StreamConsumerSchema,
    ),
    ServerModel: client.model<IServerDocument>("Server", ServerSchema),
  };
}
