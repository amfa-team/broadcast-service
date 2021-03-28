import { getSpace } from "@amfa-team/space-service-node";
import {
  canAccessSpace,
  canManageSpace,
  checkBan,
  parseUserServiceToken,
} from "@amfa-team/user-service-node";
import type { IPublicUserData } from "@amfa-team/user-service-types";
import type { APIGatewayEventRequestContext } from "aws-lambda";
import type { Role } from "../../../types/src/db/participant";
import ForbiddenError from "../io/exceptions/ForbiddenError";
import type { WithToken } from "../io/types";

export function authAdmin({ token }: { token: string }): void {
  if (!process.env.SECRET) {
    throw new Error("Missing SECRET env-vars");
  }

  if (token !== process.env.SECRET) {
    throw new Error("Someone is trying to access admin");
  }
}

export async function authParticipant(
  { token, spaceId }: WithToken,
  role: Role,
  requestContext: APIGatewayEventRequestContext,
): Promise<IPublicUserData> {
  const userData = parseUserServiceToken(token);
  const [space] = await Promise.all([
    getSpace(spaceId, token),
    checkBan(requestContext, () => {
      throw new ForbiddenError("banned");
    }),
  ]);

  if (!space) {
    throw new ForbiddenError("space does not exists");
  }

  if (role === "host") {
    if (!canManageSpace(userData, spaceId)) {
      throw new ForbiddenError("not allowed to host");
    }
  } else if (!space.public && !canAccessSpace(userData, spaceId)) {
    throw new ForbiddenError("not public");
  }

  return userData;
}
