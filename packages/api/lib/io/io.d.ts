import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import type { Role } from "../../../types/src/db/participant";
import type { ParticipantRequest, Request, WsParticipantRequest } from "./types";
export declare function wsOnlyRoute(event: APIGatewayProxyEvent): string;
export declare function parse(body: string | null): unknown;
export declare function parseHttpParticipantRequest<T>(event: APIGatewayProxyEvent, roles: Role[], decoder: JsonDecoder.Decoder<T>): Promise<ParticipantRequest<T>>;
export declare function parseHttpAdminRequest<T>(event: APIGatewayProxyEvent, decoder: JsonDecoder.Decoder<T>): Promise<Request<T>>;
export declare function parseWsParticipantRequest<T>(event: APIGatewayProxyEvent, roles: Role[], decoder: JsonDecoder.Decoder<T>): Promise<WsParticipantRequest<T>>;
export declare function handleHttpErrorResponse(e: unknown, msgId?: string | null): Promise<APIGatewayProxyResult>;
export declare function handleSuccessResponse(data: unknown, msgId?: string | null): APIGatewayProxyResult;
export declare function postToConnection(connectionId: string, data: string): Promise<void>;
export declare function broadcastToConnections(data: string): Promise<void>;
export declare function handleWebSocketSuccessResponse(connectionId: string, msgId: string, data: unknown): Promise<APIGatewayProxyResult>;
export declare function handleWebSocketErrorResponse(connectionId: string, msgId: string | null, e: unknown): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=io.d.ts.map