import { Participant } from "../db/models/participant";

export interface Request<T> {
  token: string;
  data: T;
}

export interface WsRequest<T> {
  token: string;
  data: T;
  msgId: string;
}

export interface ParticipantRequest<T> extends Request<T> {
  participant: Participant;
}

export interface WsParticipantRequest<T>
  extends WsRequest<T>,
    ParticipantRequest<T> {}

export interface WithToken {
  token: string;
}
