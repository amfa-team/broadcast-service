import fetch, { RequestInit } from "node-fetch";
import { Role } from "../db/models/participant";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getServers } from "../db/repositories/serverRepository";
import { Server } from "../db/models/server";
import { handleHttpErrorResponse } from "../io/io";

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
  role: Role | null,
  path: string,
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    // await authParticipant(event, role);
    const server = await getDestServer();

    const options: RequestInit = {
      method: event.httpMethod,
      headers: { ...event.headers, "x-api-key": server.token },
    };

    if (event.body) {
      options.body = event.body;
    }

    const res = await fetch(
      "http://" + server.ip + ":" + server.port + path,
      options
    );

    return {
      statusCode: res.status,
      body: await res.text().catch(() => "Unexpected SFU Error"),
    };
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}
