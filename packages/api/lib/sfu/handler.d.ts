import "source-map-support/register";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export declare function routerCapabilities(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function refreshConnection(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function ping(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function disconnect(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function initConnect(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function createConnect(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function createSend(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function getStreams(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function createReceive(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function handleOnChangeStreamState(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function handleOnChangeConsumerStreamState(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
export declare function handleGetConsumerStreamState(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=handler.d.ts.map