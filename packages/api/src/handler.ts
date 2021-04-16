import { AWSLambda } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { registerServer, topology } from "./admin/handler";
import NotFoundError from "./io/exceptions/NotFound";
import { handleHttpErrorResponse, handleWebSocketErrorResponse } from "./io/io";
import { consumerStateChange, producerStateChange } from "./sfu/eventHandler";
import {
  createConnect,
  createReceive,
  createSend,
  disconnect,
  getStreams,
  handleGetConsumerStreamState,
  handleOnChangeConsumerStreamState,
  handleOnChangeStreamState,
  initConnect,
  ping,
  refreshConnection,
  routerCapabilities,
} from "./sfu/handler";

export const handler = AWSLambda.wrapHandler(async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  if (event.requestContext.eventType === "MESSAGE") {
    switch (event.requestContext.routeKey) {
      case "/sfu/router-capabilities":
        return routerCapabilities(event, context);
      case "/sfu/connect/init":
        return initConnect(event, context);
      case "/sfu/refresh":
        return refreshConnection(event, context);
      case "/sfu/connect/create":
        return createConnect(event, context);
      case "/sfu/send/create":
        return createSend(event, context);
      case "/sfu/send/state":
        return handleOnChangeStreamState(event, context);
      case "/sfu/send/list":
        return getStreams(event, context);
      case "/sfu/receive/create":
        return createReceive(event, context);
      case "/sfu/receive/state":
        return handleOnChangeConsumerStreamState(event, context);
      case "/sfu/receive/state/get":
        return handleGetConsumerStreamState(event, context);
      case "/sfu/ping":
        return ping(event, context);
      default:
        return handleWebSocketErrorResponse(
          event.requestContext.connectionId ?? "",
          "",
          new NotFoundError(event.requestContext.routeKey ?? "--"),
        );
    }
  }

  if (event.requestContext.eventType === "DISCONNECT") {
    return disconnect(event, context);
  }

  switch (event.resource) {
    case "/admin/topology":
      return topology(event, context);
    case "/admin/server":
      return registerServer(event, context);
    case "/event/producer/state/change":
      return producerStateChange(event);
    case "/event/consumer/state/change":
      return consumerStateChange(event);
    default:
      return handleHttpErrorResponse(new NotFoundError(event.resource), null);
  }
});
