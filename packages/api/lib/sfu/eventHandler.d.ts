import "source-map-support/register";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export declare function producerStateChange(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function consumerStateChange(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=eventHandler.d.ts.map