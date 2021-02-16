// eslint-disable-next-line import/no-unassigned-import
import "source-map-support/register";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { createServerDecoder } from "../../../types/src/db/server";
import { getAllConnections } from "../db/repositories/connectionRepository";
import { getAllRecvTransport } from "../db/repositories/recvTransportRepository";
import { getAllSendTransport } from "../db/repositories/sendTransportRepository";
import {
  createServer,
  getAllServers,
  getServer,
} from "../db/repositories/serverRepository";
import { getAllStreamConsumers } from "../db/repositories/streamConsumerRepository";
import { getAllStreams } from "../db/repositories/streamRepository";
import {
  broadcastToConnections,
  handleHttpErrorResponse,
  handleSuccessResponse,
  init,
  parseHttpAdminRequest,
} from "../io/io";
import { requestServer } from "../sfu/serverService";

export async function topology(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  try {
    await init(context);
    await parseHttpAdminRequest(event, JsonDecoder.isNull(null));
    const [
      servers,
      connections,
      sendTransports,
      recvTransports,
      streams,
      streamConsumers,
      serverTopology,
    ] = await Promise.all([
      getAllServers(),
      getAllConnections(),
      getAllSendTransport(),
      getAllRecvTransport(),
      getAllStreams(),
      getAllStreamConsumers(),
      requestServer("/topology").catch(() => null),
    ]);

    return handleSuccessResponse({
      db: {
        servers,
        connections,
        sendTransports,
        recvTransports,
        streams,
        streamConsumers,
      },
      server: serverTopology,
    });
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}

export async function registerServer(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  try {
    // TODO: check resources sync
    await init(context);
    const { data } = await parseHttpAdminRequest(event, createServerDecoder);
    const [existingServer, server] = await Promise.all([
      getServer(data),
      createServer(data),
    ]);

    // // TODO: recreate client side properly
    // // This is to ensure we're able to recover from Server failure restart
    if (existingServer !== null && existingServer.token !== data.token) {
      console.error("Server restarted, trigger client restart");
      await broadcastToConnections(
        JSON.stringify({
          type: "cmd",
          payload: {
            fn: "reload",
          },
        }),
      );
    }

    return handleSuccessResponse(server);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}
