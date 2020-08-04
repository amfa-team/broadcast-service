import fetch, { RequestInit } from "node-fetch";
import { Role } from "../db/models/participant";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getServers } from "../db/repositories/serverRepository";
import { Server } from "../db/models/server";
import {
  wsOnlyRoute,
  parseWsParticipantRequest,
  handleWebSocketSuccessResponse,
  handleWebSocketErrorResponse,
} from "../io/io";
import { JsonDecoder } from "ts.data.json";

async function getDestServer(): Promise<Server> {
  const servers = await getServers();
  if (servers.length === 0) {
    throw new Error("No registered server");
  }

  return servers[0];
}

export async function requestSFU<T>(
  path: string,
  options: RequestInit | null = null
): Promise<T> {
  const server = await getDestServer();

  const res = await fetch("http://" + server.ip + ":" + server.port + path, {
    ...options,
    headers: {
      ...(options?.headers ?? null),
      "x-api-key": server.token,
    },
  });

  if (!res.ok) {
    const err = await res
      .json()
      .then((body) => body.error)
      .catch(() => "Unknown SFU error");
    throw new Error(`requestSFU: fail with ${err}`);
  }

  const body = await res.json();
  if (!body.success) {
    throw new Error(`requestSFU: fail with ${body.error}`);
  }

  return body.payload;
}

export async function postToSFU<T>(path: string, data: unknown): Promise<T> {
  const options: RequestInit = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  };

  return requestSFU(path, options);
}

export async function pipeToSFU(
  roles: Role[],
  path: string,
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const connectionId = wsOnlyRoute(event);

  try {
    const req = await parseWsParticipantRequest(
      event,
      roles,
      // No validation, it's just a pipe
      JsonDecoder.succeed
    );

    try {
      const payload = await postToSFU(path, req.data);

      return handleWebSocketSuccessResponse(connectionId, req.msgId, payload);
    } catch (e) {
      return handleWebSocketErrorResponse(connectionId, req.msgId, e);
    }
  } catch (e) {
    return handleWebSocketErrorResponse(connectionId, null, e);
  }
}
