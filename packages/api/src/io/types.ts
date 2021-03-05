import type { IPublicUserData } from "@amfa-team/user-service-types";

export interface Request<T> {
  token: string;
  data: T;
}

export interface RequestContext {
  domainName?: string;
  stage: string;
}

export interface WsRequest<T> {
  token: string;
  spaceId: string;
  data: T;
  msgId: string;
}

export interface ParticipantRequest<T> extends Request<T> {
  participant: IPublicUserData;
}

export interface WsParticipantRequest<T>
  extends WsRequest<T>,
    ParticipantRequest<T> {}

export interface WithToken {
  token: string;
  spaceId: string;
}
