import { ApiGatewayManagementApi } from "aws-sdk";
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { InvalidRequestError } from "./exceptions";
import { authParticipant, authAdmin } from "../security/security";
import {
  ParticipantRequest,
  Request,
  WsRequest,
  WsParticipantRequest,
} from "./types";
import { Role } from "../db/types/participant";
import { getAllConnections } from "../db/repositories/connectionRepository";
import { getAllSettledValues } from "./promises";

const DOMAIN_NAME = process.env.WEBSOCKET_DOMAIN ?? "";

const apigwManagementApi: ApiGatewayManagementApi = new ApiGatewayManagementApi(
  process.env.IS_OFFLINE
    ? { apiVersion: "2018-11-29", endpoint: `http://localhost:3001` }
    : { apiVersion: "2018-11-29", endpoint: `${DOMAIN_NAME}` }
);

export function wsOnlyRoute(event: APIGatewayProxyEvent): string {
  const { connectionId } = event.requestContext;

  if (!connectionId) {
    throw new Error(`Route: Require websocket connection`);
  }

  return connectionId;
}

export function parse(body: string | null): unknown {
  try {
    return body === null ? body : JSON.parse(body);
  } catch (e) {
    throw new InvalidRequestError(`Unable to parse body: ${e.message}`);
  }
}

function decode<T>(data: unknown, decoder: JsonDecoder.Decoder<T>): T {
  const result = decoder.decode(data);

  if (!result.isOk()) {
    throw new InvalidRequestError(result.error);
  }

  return result.value;
}

function parseWsRequest<T>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>
): WsRequest<T> {
  const body = parse(event.body);

  const requestDecoder = JsonDecoder.object<WsRequest<T>>(
    {
      token: JsonDecoder.string,
      data: decoder,
      msgId: JsonDecoder.string,
    },
    "WebSocketRequest"
  );

  return decode(body, requestDecoder);
}

function parseHttpRequest<T>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>
): Request<T> {
  const token = event?.headers?.["x-api-key"];

  if (!token) {
    throw new InvalidRequestError("Missing x-api-key header");
  }

  const body = parse(event.body);

  return { token, data: decode(body, decoder) };
}

export async function parseHttpParticipantRequest<T>(
  event: APIGatewayProxyEvent,
  roles: Role[],
  decoder: JsonDecoder.Decoder<T>
): Promise<ParticipantRequest<T>> {
  const result = parseHttpRequest(event, decoder);
  const participant = await authParticipant(result, roles);

  return {
    ...result,
    participant,
  };
}

export async function parseHttpAdminRequest<T>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>
): Promise<Request<T>> {
  const result = parseHttpRequest(event, decoder);
  await authAdmin(result);

  return result;
}

export async function parseWsParticipantRequest<T>(
  event: APIGatewayProxyEvent,
  roles: Role[],
  decoder: JsonDecoder.Decoder<T>
): Promise<WsParticipantRequest<T>> {
  const result = parseWsRequest(event, decoder);
  const participant = await authParticipant(result, roles);

  return {
    ...result,
    participant,
  };
}

export function handleHttpErrorResponse(
  e: unknown,
  msgId: string | null = null
): APIGatewayProxyResult {
  if (e instanceof InvalidRequestError) {
    return {
      statusCode: e.code,
      body: JSON.stringify({
        success: false,
        error: e.message,
        msgId,
      }),
    };
  }

  console.error(e);

  return {
    statusCode: 500,
    body: JSON.stringify({
      success: false,
      error: "Unexpected Server error",
    }),
  };
}

export function handleSuccessResponse(
  data: unknown,
  msgId: string | null = null
): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      type: "response",
      success: true,
      payload: data,
      msgId,
    }),
  };
}

export async function postToConnection(
  connectionId: string,
  data: string
): Promise<void> {
  try {
    await apigwManagementApi
      .postToConnection({
        ConnectionId: connectionId,
        Data: data,
      })
      .promise();
  } catch (e) {
    // 410 Gone error
    // https://medium.com/@lancers/websocket-api-what-does-it-mean-that-disconnect-is-a-best-effort-event-317b7021456f
    if (typeof e === "object" && e?.statusCode === 410) {
      console.warn("io.postToConnection: client gone", connectionId);
    } else {
      throw e;
    }
  }
}

export async function broadcastToConnections(data: string): Promise<void> {
  const connections = await getAllConnections();
  const results = await Promise.allSettled(
    connections.map((c) => postToConnection(c.connectionId, data))
  );
  getAllSettledValues(results, "broadcastToConnections: Unexpected Error");
}

export async function handleWebSocketSuccessResponse(
  connectionId: string,
  msgId: string,
  data: unknown
): Promise<APIGatewayProxyResult> {
  const result = handleSuccessResponse(data, msgId);

  // Lambda response is sent through WebSocket in Api Gateway but not in serverless offline
  // https://github.com/dherault/serverless-offline/issues/1008
  if (process.env.IS_OFFLINE) {
    await postToConnection(connectionId, result.body);
  }

  return result;
}

export async function handleWebSocketErrorResponse(
  connectionId: string,
  msgId: string | null,
  e: unknown
): Promise<APIGatewayProxyResult> {
  const result = handleHttpErrorResponse(e, msgId);

  // Lambda response is sent through WebSocket in Api Gateway but not in serverless offline
  // https://github.com/dherault/serverless-offline/issues/1008
  if (process.env.IS_OFFLINE) {
    await postToConnection(connectionId, result.body);
  }

  return result;
}
