import { JsonDecoder } from "ts.data.json";
export declare enum Role {
    host = "host",
    guest = "guest"
}
export interface CreateParticipant {
    role: Role;
}
export interface Participant extends CreateParticipant {
    token: string;
}
export declare const createParticipantDecoder: JsonDecoder.Decoder<CreateParticipant>;
//# sourceMappingURL=participant.d.ts.map