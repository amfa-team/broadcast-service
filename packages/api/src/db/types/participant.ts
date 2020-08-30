import { JsonDecoder } from "ts.data.json";

export enum Role {
  host = "host",
  guest = "guest",
}

export interface CreateParticipant {
  role: Role;
}

export interface Participant extends CreateParticipant {
  token: string; // Token is generated
}

export const createParticipantDecoder = JsonDecoder.object<CreateParticipant>(
  {
    role: JsonDecoder.oneOf(
      Object.values(Role).map((v) => JsonDecoder.isExactly(v)),
      "role"
    ),
  },
  "CreateParticipant"
);
