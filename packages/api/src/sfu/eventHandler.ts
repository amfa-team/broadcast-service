import "source-map-support/register";
import { JsonDecoder } from "ts.data.json";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  handleSuccessResponse,
  handleHttpErrorResponse,
  parseHttpAdminRequest,
} from "../io/io";
import { onScoreChange } from "./streamService";

export async function scoreChange(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const { data } = await parseHttpAdminRequest(
      event,
      JsonDecoder.object(
        {
          transportId: JsonDecoder.string,
          producerId: JsonDecoder.string,
          score: JsonDecoder.number,
        },
        "ScoreChange"
      )
    );
    const payload = await onScoreChange({
      ...data,
      requestContext: event.requestContext,
    });

    return handleSuccessResponse(payload);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}
