import "source-map-support/register";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { pipeToSFU, requestSFU } from "./pipeToSFU";
import { Role } from "../db/models/participant";
import { createConnection } from "../db/repositories/connectionRepository";
import {
  parseWsParticipantRequest,
  handleWebSocketSuccessResponse,
  handleWebSocketErrorResponse,
  wsOnlyRoute,
} from "../io/io";

export async function routerCapabilities(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest(
      event,
      [Role.host, Role.guest],
      JsonDecoder.isNull(null)
    );

    try {
      await createConnection({
        connectionId,
        token: req.token,
      });

      const payload = await requestSFU("/router-capabilities");

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function initConnect(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU([Role.host, Role.guest], "/connect/init", event);
}

export async function createConnect(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU([Role.host, Role.guest], "/connect/create", event);
}

export async function createSend(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU([Role.host], "/send/create", event);
}

export async function createReceive(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU([Role.host, Role.guest], "/receive/create", event);
}

export async function playReceive(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU([Role.host, Role.guest], "/receive/play", event);
}
