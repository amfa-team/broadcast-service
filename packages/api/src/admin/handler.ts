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

export async function listParticipants(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    await parseHttpAdminRequest(event, JsonDecoder.isNull(null));
    const participants = await getAllParticipants();
    return handleSuccessResponse(participants);
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

export async function listServers(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    await parseHttpAdminRequest(event, JsonDecoder.isNull(null));
    const servers = await getAllServers();
    return handleSuccessResponse(servers);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}
