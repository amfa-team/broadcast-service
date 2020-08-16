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
  ChangeStreamStateEvent,
  onChangeStreamState,
  onChangeConsumerStreamState,
  ChangeConsumerStreamStateEvent,
} from "./sfuService";

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
      await onNewConnection({
        connectionId,
        token: req.token,
      });

      const payload = await requestSFU("/router-capabilities");

      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        payload
      );
    } catch (e) {
      return handleWebSocketErrorResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        e
      );
    }
  } catch (e) {
    return handleWebSocketErrorResponse(
      event.requestContext,
      connectionId,
      null,
      e
    );
  }
}

export async function ping(
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
      const payload = "pong";

      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        payload
      );
    } catch (e) {
      return handleWebSocketErrorResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        e
      );
    }
  } catch (e) {
    return handleWebSocketErrorResponse(
      event.requestContext,
      connectionId,
      null,
      e
    );
  }
}

export async function disconnect(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    try {
      // There is 2 types of disconnect clean & unclean
      //    - clean: client or server close explicitly
      //    - unclean: network errors, client crash...

      // TODO: handle clean disconnect on websocket timeout (i.e. 2 hours) without cutting the stream
      // TODO: handle reconnect after unclean (client crash)
      // TODO: handle disconnect (pause stream?) when unclean disconnect (idle timeout is 10min)
      // TODO: prevent idle timeout by sending ping
      await onDisconnect(event.requestContext, connectionId);
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

      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        payload
      );
    } catch (e) {
      return handleWebSocketErrorResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        e
      );
    }
  } catch (e) {
    return handleWebSocketErrorResponse(
      event.requestContext,
      connectionId,
      null,
      e
    );
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
      const producerId = await onCreateStream(
        event.requestContext,
        connectionId,
        req.data
      );

      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        producerId
      );
    } catch (e) {
      return handleWebSocketErrorResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        e
      );
    }
  } catch (e) {
    return handleWebSocketErrorResponse(
      event.requestContext,
      connectionId,
      null,
      e
    );
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
      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        streams
      );
    } catch (e) {
      return handleWebSocketErrorResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        e
      );
    }
  } catch (e) {
    return handleWebSocketErrorResponse(
      event.requestContext,
      connectionId,
      null,
      e
    );
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

      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        payload
      );
    } catch (e) {
      return handleWebSocketErrorResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        e
      );
    }
  } catch (e) {
    return handleWebSocketErrorResponse(
      event.requestContext,
      connectionId,
      null,
      e
    );
  }
}

export async function handleOnChangeStreamState(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest<ChangeStreamStateEvent>(
      event,
      [Role.host, Role.guest],
      JsonDecoder.object(
        {
          transportId: JsonDecoder.string,
          producerId: JsonDecoder.string,
          state: JsonDecoder.isExactly("close"),
        },
        "ChangeStreamStateEvent"
      )
    );

    try {
      const payload = await onChangeStreamState(event.requestContext, req.data);

      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        payload
      );
    } catch (e) {
      return handleWebSocketErrorResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        e
      );
    }
  } catch (e) {
    return handleWebSocketErrorResponse(
      event.requestContext,
      connectionId,
      null,
      e
    );
  }
}

export async function handleOnChangeConsumerStreamState(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest<ChangeConsumerStreamStateEvent>(
      event,
      [Role.host, Role.guest],
      JsonDecoder.object(
        {
          transportId: JsonDecoder.string,
          consumerId: JsonDecoder.string,
          state: JsonDecoder.oneOf(
            [JsonDecoder.isExactly("play"), JsonDecoder.isExactly("pause")],
            "state"
          ),
        },
        "ChangeConsumerStreamStateEvent"
      )
    );

    try {
      const payload = await onChangeConsumerStreamState(req.data);

      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        payload
      );
    } catch (e) {
      return handleWebSocketErrorResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        e
      );
    }
  } catch (e) {
    return handleWebSocketErrorResponse(
      event.requestContext,
      connectionId,
      null,
      e
    );
  }
}
