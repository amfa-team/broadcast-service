import { JsonDecoder } from "ts.data.json";
export var Role;
(function (Role) {
    Role["host"] = "host";
    Role["guest"] = "guest";
})(Role || (Role = {}));
export const createParticipantDecoder = JsonDecoder.object({
    role: JsonDecoder.oneOf(Object.values(Role).map((v) => JsonDecoder.isExactly(v)), "role"),
}, "CreateParticipant");
//# sourceMappingURL=participant.js.map