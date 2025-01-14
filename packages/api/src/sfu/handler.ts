import type {
  ReceiveParams,
  SendParams,
} from "@amfa-team/broadcast-service-types";
import { Role } from "@amfa-team/broadcast-service-types";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { getAllStreams } from "../db/repositories/streamRepository";
import {
  handleHttpErrorResponse,
  handleSuccessResponse,
  handleWebSocketErrorResponse,
  handleWebSocketSuccessResponse,
  init,
  parseWsParticipantRequest,
  wsOnlyRoute,
} from "../io/io";
import {
  onConnect,
  onDisconnect,
  onPing,
  onRefreshConnection,
} from "./connectionService";
import {
  onConnectRecvTransport,
  onInitRecvTransport,
} from "./recvTransportService";
import {
  onConnectSendTransport,
  onInitSendTransport,
} from "./sendTransportService";
import {
  decodeChangeStreamConsumerStateData,
  decodeRecvParams,
  getStreamConsumerState,
  onChangeStreamConsumerState,
  onCreateStreamConsumer,
} from "./streamConsumerService";
import {
  decodeOnChangeStreamStateData,
  decodeSendParams,
  onChangeStreamState,
  onCreateStream,
} from "./streamService";

export async function routerCapabilities(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest(
      event,
      Role.guest,
      JsonDecoder.isNull(null),
    );

    try {
      const payload = await onConnect({
        connectionId,
        token: req.token,
      });

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function refreshConnection(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest(
      event,
      Role.guest,
      JsonDecoder.isNull(null),
    );

    try {
      const payload = await onRefreshConnection({
        connectionId,
        token: req.token,
      });

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function ping(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest(
      event,
      Role.guest,
      JsonDecoder.isNull(null),
    );

    try {
      return handleWebSocketSuccessResponse(connectionId, req.msgId, onPing());
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function disconnect(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    try {
      await init(context);
      await onDisconnect({
        connectionId,
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
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest(
      event,
      Role.guest,
      // No validation, it's just a pipe
      JsonDecoder.succeed,
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

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function createConnect(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest(
      event,
      Role.guest,
      // No validation, it's just a pipe
      JsonDecoder.succeed,
    );

    try {
      const params = { connectionId, data: req.data };
      const payload =
        req.data.type === "send"
          ? await onConnectSendTransport(params)
          : await onConnectRecvTransport(params);

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function createSend(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest<SendParams>(
      event,
      Role.host,
      decodeSendParams,
    );

    try {
      const producerId = await onCreateStream({
        connectionId,
        data: req.data,
      });

      return handleWebSocketSuccessResponse(
        connectionId,
        req.msgId,
        producerId,
      );
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function getStreams(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest<null>(
      event,
      Role.guest,
      JsonDecoder.isNull(null),
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
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest<ReceiveParams>(
      event,
      Role.guest,
      decodeRecvParams,
    );

    try {
      const payload = await onCreateStreamConsumer({
        connectionId,
        data: req.data,
      });

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function handleOnChangeStreamState(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest(
      event,
      Role.guest,
      decodeOnChangeStreamStateData,
    );

    try {
      const payload = await onChangeStreamState({
        connectionId,
        data: req.data,
      });

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function handleOnChangeConsumerStreamState(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest(
      event,
      Role.guest,
      decodeChangeStreamConsumerStateData,
    );

    try {
      const payload = await onChangeStreamConsumerState({
        data: req.data,
      });

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}

export async function handleGetConsumerStreamState(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    await init(context);
    const req = await parseWsParticipantRequest(
      event,
      Role.guest,
      JsonDecoder.object(
        {
          consumerId: JsonDecoder.string,
          transportId: JsonDecoder.string,
        },
        "ConsumerKey",
      ),
    );

    try {
      const payload = await getStreamConsumerState(req.data);

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}
