import type { Participant, Role } from "../../../types/src/db/participant";
import type { WithToken } from "../io/types";
export declare function authAdmin({ token }: WithToken): void;
export declare function authParticipant({ token }: WithToken, roles: Role[]): Promise<Participant>;
//# sourceMappingURL=security.d.ts.map