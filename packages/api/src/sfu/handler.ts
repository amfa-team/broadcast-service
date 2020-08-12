import "source-map-support/register";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { pipeToSFU, requestSFU } from "./pipeToSFU";
import { Role } from "../db/models/participant";
import {
  parseWsParticipantRequest,
  handleWebSocketSuccessResponse,
  handleWebSocketErrorResponse,
  wsOnlyRoute,
  handleHttpErrorResponse,
  handleSuccessResponse,
} from "../io/io";
import type { SendParams, ReceiveParams } from "../../../types";
import { getAllStreams } from "../db/repositories/streamRepository";
import {
  onNewConnection,
  onDisconnect,
  onRequestNewTransport,
  onCreateStream,
  onCreateConsumerStream,
} from "./sfuService";

export async function routerCapabilities(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  console.warn(connectionId);

  try {
    const req = await parseWsParticipantRequest(
      event,
      [Role.host, Role.guest],
      JsonDecoder.isNull(null)
    );

    try {
      await onNewConnection({
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
      await onDisconnect(connectionId);
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
    const req = await parseWsParticipantRequest(
      event,
      [Role.host, Role.guest],
      // No validation, it's just a pipe
      JsonDecoder.succeed
    );

    try {
      const payload = await onRequestNewTransport(connectionId, req.data);

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
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest<SendParams>(
      event,
      [Role.host],
      JsonDecoder.object(
        {
          transportId: JsonDecoder.string,
          kind: JsonDecoder.oneOf(
            [JsonDecoder.isExactly("audio"), JsonDecoder.isExactly("video")],
            "kind"
          ),
          rtpParameters: JsonDecoder.succeed,
        },
        "SendParams"
      )
    );

    try {
      const producerId = await onCreateStream(connectionId, req.data);

      return handleWebSocketSuccessResponse(
        connectionId,
        req.msgId,
        producerId
      );
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function getStreams(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest<null>(
      event,
      [Role.host, Role.guest],
      JsonDecoder.isNull(null)
    );

    const streams = await getAllStreams();

    try {
      return handleWebSocketSuccessResponse(connectionId, req.msgId, streams);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function createReceive(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest<ReceiveParams>(
      event,
      [Role.host, Role.guest],
      JsonDecoder.object(
        {
          transportId: JsonDecoder.string,
          sourceTransportId: JsonDecoder.string,
          producerId: JsonDecoder.string,
          rtpCapabilities: JsonDecoder.succeed,
        },
        "ReceiveParams"
      )
    );

    try {
      const payload = await onCreateConsumerStream(connectionId, req.data);

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function playReceive(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU([Role.host, Role.guest], "/receive/play", event);
}
