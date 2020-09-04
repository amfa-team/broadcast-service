import "source-map-support/register";
import { JsonDecoder } from "ts.data.json";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  handleSuccessResponse,
  handleHttpErrorResponse,
  parseHttpAdminRequest,
} from "../io/io";
import { onProducerStateChange } from "./streamService";
import { onConsumerStateChange } from "./streamConsumerService";

export async function producerStateChange(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const { data } = await parseHttpAdminRequest(
      event,
      JsonDecoder.object(
        {
          transportId: JsonDecoder.string,
          producerId: JsonDecoder.string,
          state: JsonDecoder.object(
            {
              score: JsonDecoder.number,
              paused: JsonDecoder.boolean,
            },
            "ProducerState"
          ),
        },
        "ProducerStateChange"
      )
    );
    const payload = await onProducerStateChange({
      ...data,
      requestContext: event.requestContext,
    });

    return handleSuccessResponse(payload);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}

export async function consumerStateChange(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const { data } = await parseHttpAdminRequest(
      event,
      JsonDecoder.object(
        {
          transportId: JsonDecoder.string,
          consumerId: JsonDecoder.string,
          state: JsonDecoder.object(
            {
              score: JsonDecoder.number,
              producerScore: JsonDecoder.number,
              paused: JsonDecoder.boolean,
              producerPaused: JsonDecoder.boolean,
            },
            "ConsumerState"
          ),
        },
        "ConsumerStateChange"
      )
    );
    const payload = await onConsumerStateChange({
      ...data,
      requestContext: event.requestContext,
    });

    return handleSuccessResponse(payload);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}
