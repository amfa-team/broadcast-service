import "source-map-support/register";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { pipeToSFU, requestSFU, postToSFU } from "./pipeToSFU";
import { Role } from "../db/models/participant";
import {
  createConnection,
  deleteConnection,
  findByConnectionId,
  updateConnection,
} from "../db/repositories/connectionRepository";
import {
  parseWsParticipantRequest,
  handleWebSocketSuccessResponse,
  handleWebSocketErrorResponse,
  wsOnlyRoute,
  handleHttpErrorResponse,
  handleSuccessResponse,
} from "../io/io";
import type { ConnectionInfo } from "../../../types";

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

export async function disconnect(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    try {
      const connection = await findByConnectionId(connectionId);
      await deleteConnection(connectionId);

      if (connection !== null && connection.transportId !== null) {
        // TODO: do not destroy directly the transport
        // Try to handle reconnect via a new websocket for 30s?
        await postToSFU<null>("/connect/destroy", {
          transportId: connection.transportId,
        });
      }

      return handleSuccessResponse(null);
    } catch (e) {
      return handleHttpErrorResponse(connectionId, e);
    }
  } catch (e) {
    return handleHttpErrorResponse(connectionId, e);
  }
}

export async function initConnect(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    const connection = await findByConnectionId(connectionId);
    if (connection === null) {
      throw new Error("initConnect: ws connection not found");
    }

    const req = await parseWsParticipantRequest(
      event,
      [Role.host, Role.guest],
      // No validation, it's just a pipe
      JsonDecoder.succeed
    );

    try {
      const payload = await postToSFU<ConnectionInfo>(
        "/connect/init",
        req.data
      );

      // TODO: Handle connection removed
      await updateConnection({
        connectionId,
        transportId: payload.transportId,
      });

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
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
