import "source-map-support/register";
import { JsonDecoder } from "ts.data.json";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  createParticipant,
  getAllParticipants,
} from "../db/repositories/participantRepository";
import {
  createServer,
  getAllServers,
  getServer,
} from "../db/repositories/serverRepository";
import { createParticipantDecoder } from "../db/types/participant";
import { createServerDecoder } from "../db/types/server";
import {
  handleSuccessResponse,
  handleHttpErrorResponse,
  parseHttpAdminRequest,
  broadcastToConnections,
} from "../io/io";
import { getAllConnections } from "../db/repositories/connectionRepository";
import { getAllSendTransport } from "../db/repositories/sendTransportRepository";
import { getAllRecvTransport } from "../db/repositories/recvTransportRepository";
import { getAllStreams } from "../db/repositories/streamRepository";
import { getAllStreamConsumers } from "../db/repositories/streamConsumerRepository";
import { requestServer } from "../sfu/serverService";

export async function registerParticipant(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const { data } = await parseHttpAdminRequest(
      event,
      createParticipantDecoder
    );
    const participant = await createParticipant(data);

    return handleSuccessResponse(participant);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}

export async function topology(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    await parseHttpAdminRequest(event, JsonDecoder.isNull(null));
    const [
      participants,
      servers,
      connections,
      sendTransports,
      recvTransports,
      streams,
      streamConsumers,
      topology,
    ] = await Promise.all([
      getAllParticipants(),
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
        participants,
        servers,
        connections,
        sendTransports,
        recvTransports,
        streams,
        streamConsumers,
      },
      server: topology,
    });
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}

export async function registerServer(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    // TODO: check resources sync
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
        })
      );
    }

    return handleSuccessResponse(server);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}
