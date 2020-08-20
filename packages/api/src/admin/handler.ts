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
import { createParticipantDecoder } from "../db/models/participant";
import { createServerDecoder } from "../db/models/server";
import {
  handleSuccessResponse,
  handleHttpErrorResponse,
  parseHttpAdminRequest,
  broadcastToConnections,
} from "../io/io";
import { getAllConnections } from "../db/repositories/connectionRepository";
import { getAllStreams } from "../db/repositories/streamRepository";
import { getStreamConsumers } from "../db/repositories/streamConsumerRepository";
import { requestSFU } from "../sfu/pipeToSFU";

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
      streams,
      streamConsumers,
      topology,
    ] = await Promise.all([
      getAllParticipants(),
      getAllServers(),
      getAllConnections(),
      getAllStreams(),
      getStreamConsumers(),
      requestSFU("/topology").catch(() => null),
    ]);

    return handleSuccessResponse({
      db: {
        participants,
        servers,
        connections,
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

    // TODO: recreate client side properly
    // This is to ensure we're able to recover from Server failure restart
    if (existingServer !== null && existingServer.token !== data.token) {
      console.error("Server restarted, trigger client restart");
      await broadcastToConnections(
        event.requestContext,
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
    console.error(e);
    return handleHttpErrorResponse(e);
  }
}
