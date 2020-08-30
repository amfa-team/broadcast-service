import "source-map-support/register";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { Role } from "../db/types/participant";
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
  onConnect,
  onDisconnect,
  onPing,
  onRefreshConnection,
} from "./connectionService";
import {
  onInitSendTransport,
  onConnectSendTransport,
} from "./sendTransportService";
import {
  onConnectRecvTransport,
  onInitRecvTransport,
} from "./recvTransportService";
import {
  onCreateStream,
  decodeSendParams,
  decodeOnChangeStreamStateData,
  onChangeStreamState,
} from "./streamService";
import {
  decodeRecvParams,
  onCreateStreamConsumer,
  decodeChangeStreamConsumerStateData,
  onChangeStreamConsumerState,
} from "./streamConsumerService";

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
      const payload = await onConnect({
        requestContext: event.requestContext,
        connectionId,
        token: req.token,
      });

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

export async function refreshConnection(
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
      const payload = await onRefreshConnection({
        connectionId,
        token: req.token,
      });

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
      return handleWebSocketSuccessResponse(
        event.requestContext,
        connectionId,
        req.msgId,
        onPing()
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
      await onDisconnect({
        connectionId,
        requestContext: event.requestContext,
      });
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
      const params = {
        connectionId,
        data: req.data,
      };
      const payload =
        req.data.type === "send"
          ? await onInitSendTransport(params)
          : await onInitRecvTransport(params);

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
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest(
      event,
      [Role.host, Role.guest],
      // No validation, it's just a pipe
      JsonDecoder.succeed
    );

    try {
      const params = { connectionId, data: req.data };
      const payload =
        req.data.type === "send"
          ? await onConnectSendTransport(params)
          : await onConnectRecvTransport(params);

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

export async function createSend(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest<SendParams>(
      event,
      [Role.host],
      decodeSendParams
    );

    try {
      const producerId = await onCreateStream({
        requestContext: event.requestContext,
        connectionId,
        data: req.data,
      });

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
      decodeRecvParams
    );

    try {
      const payload = await onCreateStreamConsumer({
        connectionId,
        data: req.data,
      });

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
    const req = await parseWsParticipantRequest(
      event,
      [Role.host, Role.guest],
      decodeOnChangeStreamStateData
    );

    try {
      const payload = await onChangeStreamState({
        connectionId,
        requestContext: event.requestContext,
        data: req.data,
      });

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
    const req = await parseWsParticipantRequest(
      event,
      [Role.host, Role.guest],
      decodeChangeStreamConsumerStateData
    );

    try {
      const payload = await onChangeStreamConsumerState({
        data: req.data,
      });

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
