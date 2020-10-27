import type { CreateParticipant, Participant } from "@amfa-team/types";
export declare function createParticipant(params: CreateParticipant): Promise<Participant>;
export declare function getParticipant(token: string): Promise<Participant | null>;
export declare function getAllParticipants(): Promise<Participant[]>;
//# sourceMappingURL=participantRepository.d.ts.map