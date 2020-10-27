import "source-map-support/register";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export declare function registerParticipant(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function topology(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function registerServer(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=handler.d.ts.map