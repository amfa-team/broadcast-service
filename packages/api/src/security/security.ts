import type { Participant, Role } from "../../../types/src/db/participant";
import { getParticipant } from "../db/repositories/participantRepository";
import ForbiddenError from "../io/exceptions/ForbiddenError";
import type { WithToken } from "../io/types";

export function authAdmin({ token }: WithToken): void {
  if (!process.env.SECRET) {
    throw new Error("Missing SECRET env-vars");
  }

  if (token !== process.env.SECRET) {
    throw new Error("Someone is trying to access admin");
  }
}

export async function authParticipant(
  { token }: WithToken,
  roles: Role[],
): Promise<Participant> {
  const participant = await getParticipant(token);

  if (participant == null) {
    throw new ForbiddenError();
  }

  if (!roles.includes(participant.role)) {
    throw new ForbiddenError();
  }

  return participant;
}
