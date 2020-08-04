import "source-map-support/register";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { pipeToSFU } from "./pipeToSFU";
import { Role } from "../db/models/participant";

export async function routerCapabilities(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return pipeToSFU(null, "/router-capabilities", event);
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
