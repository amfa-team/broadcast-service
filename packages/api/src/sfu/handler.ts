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
} from "../io/io";

function wsOnlyRoute(event: APIGatewayProxyEvent): string {
  const { connectionId } = event.requestContext;

  if (!connectionId) {
    throw new Error(`Route: Require websocket connection`);
  }

  return connectionId;
}

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

  // const { token } = parseEvent(event, JsonDecoder.isNull(null));
  // console.log(data);
  // return {
  //   statusCode: 500,
  //   body: "Oops",
  // };
  // return pipeToSFU(null, "/router-capabilities", event);
}

export async function initConnect(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU(null, "/connect/init", event);
}

export async function createConnect(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU(null, "/connect/create", event);
}

export async function createSend(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU(Role.host, "/send/create", event);
}

export async function createReceive(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU(null, "/receive/create", event);
}

export async function playReceive(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU(null, "/receive/play", event);
}
