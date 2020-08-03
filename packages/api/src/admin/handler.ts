import "source-map-support/register";
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
  handleErrorResponse,
  parseAndValidate,
} from "../io/io";
import { authAdmin } from "../security/security";

export async function registerParticipant(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const participant = await createParticipant(
      parseAndValidate(event.body, createParticipantDecoder)
    );

    return handleSuccessResponse(participant);
  } catch (e) {
    return handleErrorResponse(e);
  }
}

export async function listParticipants(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    authAdmin(event);
    const participants = await getAllParticipants();
    return handleSuccessResponse(participants);
  } catch (e) {
    return handleErrorResponse(e);
  }
}

export async function registerServer(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    authAdmin(event);
    const server = await createServer(
      parseAndValidate(event.body, createServerDecoder)
    );

    return handleSuccessResponse(server);
  } catch (e) {
    return handleErrorResponse(e);
  }
}

export async function listServers(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    authAdmin(event);
    const servers = await getAllServers();
    return handleSuccessResponse(servers);
  } catch (e) {
    return handleErrorResponse(e);
  }
}
