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
} from "../db/repositories/serverRepository";
import { createParticipantDecoder } from "../db/models/participant";
import { createServerDecoder } from "../db/models/server";
import {
  handleSuccessResponse,
  handleHttpErrorResponse,
  parseHttpAdminRequest,
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
      requestSFU("/topology"),
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
    // TODO: handle server restart & check resources sync
    const { data } = await parseHttpAdminRequest(event, createServerDecoder);
    const server = await createServer(data);

    return handleSuccessResponse(server);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}
