import fetch, { RequestInit } from "node-fetch";
import { Role } from "../db/models/participant";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authParticipant } from "../security/security";
import { getServers } from "../db/repositories/serverRepository";
import { Server } from "../db/models/server";
import { handleErrorResponse } from "../io/io";

async function getDestServer(): Promise<Server> {
  const servers = await getServers();
  if (servers.length === 0) {
    throw new Error("No registered server");
  }

  return servers[0];
}

export async function pipeToSFU(
  role: Role | null,
  path: string,
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    await authParticipant(event, role);
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
    return handleErrorResponse(e);
  }
}
