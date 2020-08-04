import type { APIGatewayProxyEvent } from "aws-lambda";
import { findByToken } from "../db/repositories/participantRepository";
import { ForbiddenError, InvalidRequestError } from "../io/exceptions";
import { Participant, Role } from "../db/models/participant";

export function getToken(event: APIGatewayProxyEvent): string {
  const token = event.headers["x-api-key"];

  if (!token) {
    throw new InvalidRequestError("Missing x-api-key header");
  }

  return token;
}

export function authAdmin(event: APIGatewayProxyEvent): void {
  const token = getToken(event);

  if (!process.env.SECRET) {
    throw new Error("Missing SECRET env-vars");
  }

  if (token !== process.env.SECRET) {
    throw new Error("Someone is trying to access admin");
  }
}

export async function authParticipant(
  event: APIGatewayProxyEvent,
  role: Role | null
): Promise<Participant> {
  const token = getToken(event);
  const participant = await findByToken(token);

  if (participant == null) {
    throw new ForbiddenError();
  }

  if (role !== null && participant.role !== role) {
    throw new ForbiddenError();
  }

  return participant;
}
